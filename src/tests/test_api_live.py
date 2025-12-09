import requests
import unittest
import time
import random
import string
from datetime import datetime, timedelta, timezone

BASE_URL = "http://127.0.0.1:8000/api"

class LiveAPITests(unittest.TestCase):
    
    def setUp(self):
        # Create a unique user for each test to avoid conflicts
        self.user_uid = self.create_test_user()
        self.location_id = "1" 

    def create_test_user(self):
        """Helper to create a real user via API"""
        rand_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
        email = f"test_{rand_str}@example.com"
        password = "testpassword123"
        name = f"Test User {rand_str}"
        
        payload = {
            "email": email,
            "password": password,
            "name": name
        }
        
        response = requests.post(f"{BASE_URL}/players/", json=payload)
        if response.status_code != 201:
            raise Exception(f"Failed to create test user: {response.text}")
            
        return response.json()["uid"]

    def test_server_running(self):
        """Check if the server is reachable"""
        try:
            response = requests.get(f"{BASE_URL}/games/")
            self.assertEqual(response.status_code, 200, "Server should be running and return 200 for /games/")
        except requests.exceptions.ConnectionError:
            self.fail("Could not connect to server. Is 'python manage.py runserver' running?")

    def test_create_and_list_game(self):
        """
        Full flow:
        1. Create a game
        2. Verify it is in the list
        3. Verify details
        """
        
        start_time = (datetime.now(timezone.utc) + timedelta(hours=1)).isoformat()
        end_time = (datetime.now(timezone.utc) + timedelta(hours=2)).isoformat()
        
        payload = {
            "title": "Live Integration Test Game",
            "location_id": self.location_id,
            "created_by": self.user_uid,
            "start_time": start_time,
            "end_time": end_time
        }
        
        # 1. Create Game
        response = requests.post(f"{BASE_URL}/games/", json=payload)
        self.assertIn(response.status_code, [200, 201], f"Create game failed: {response.text}")
        
        data = response.json()
        
        # Handle backend typo 'sucess' vs 'id' depending on implementation
        # model_games.py returns {"sucess": doc_id}, views.py returns {"id": created_id}
        # Let's check what views.py actually returns.
        # views.py: created_id = game_response.get("sucess"); return Response({"id": created_id}, ...)
        
        self.assertIn("id", data)
        game_id = data["id"]
        
        # 2. List Games
        response = requests.get(f"{BASE_URL}/games/")
        self.assertEqual(response.status_code, 200)
        games = response.json()
        
        found = any(g['id'] == game_id for g in games)
        self.assertTrue(found, f"Game {game_id} not found in list")
        
        # 3. Get Details
        response = requests.get(f"{BASE_URL}/games/{game_id}/")
        self.assertEqual(response.status_code, 200)
        details = response.json()
        self.assertEqual(details['title'], "Live Integration Test Game")
        self.assertEqual(details['created_by'], self.user_uid)

    def test_join_leave_flow(self):
        # Create game as main user
        start_time = (datetime.now(timezone.utc) + timedelta(hours=3)).isoformat()
        end_time = (datetime.now(timezone.utc) + timedelta(hours=4)).isoformat()
        
        payload = {
            "title": "Join/Leave Test Game",
            "location_id": self.location_id,
            "created_by": self.user_uid,
            "start_time": start_time,
            "end_time": end_time
        }
        
        resp = requests.post(f"{BASE_URL}/games/", json=payload)
        self.assertIn(resp.status_code, [200, 201])
        game_id = resp.json().get("id")
        
        # Create a SECOND user to join
        joiner_uid = self.create_test_user()
        
        join_payload = {"player_id": joiner_uid}
        
        # Join
        resp = requests.post(f"{BASE_URL}/games/{game_id}/join/", json=join_payload)
        self.assertIn(resp.status_code, [200, 201], f"Join failed: {resp.text}")
        
        # Verify Roster
        resp = requests.get(f"{BASE_URL}/games/{game_id}/")
        roster = resp.json().get("roster", [])
        
        # Check if joiner is in roster
        # Roster items have "player_id" field which is likely the UID string based on views.py
        # views.py: "player_id": player['player_id'].id
        
        is_in_roster = any(p['player_id'] == joiner_uid for p in roster)
        self.assertTrue(is_in_roster, "Joined player not found in roster")
        
        # Leave
        resp = requests.post(f"{BASE_URL}/games/{game_id}/leave/", json=join_payload)
        self.assertIn(resp.status_code, [200, 201], f"Leave failed: {resp.text}")
        
        # Verify Roster again
        resp = requests.get(f"{BASE_URL}/games/{game_id}/")
        roster = resp.json().get("roster", [])
        is_in_roster = any(p['player_id'] == joiner_uid for p in roster)
        self.assertFalse(is_in_roster, "Player should be removed from roster")

if __name__ == '__main__':
    unittest.main()
