from django.test import TestCase
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta, timezone
from api import model_games, model_players

class GameTests(TestCase):
    
    def setUp(self):
        # Common test data
        self.user_id = "test_user_123"
        self.location_id = "1"
        self.game_data_valid = {
            'start_time': (datetime.now(timezone.utc) + timedelta(days=1)).isoformat(),
            'end_time': (datetime.now(timezone.utc) + timedelta(days=1, hours=2)).isoformat(),
            'title': 'Test Game',
            'location_id': self.location_id,
            'created_by': self.user_id,
        }

    @patch('api.model_games.locations')
    @patch('api.model_games.games')
    @patch('api.model_games.players')
    @patch('api.model_games.in_memory_scheduled')
    def test_create_game_success(self, mock_in_memory, mock_players, mock_games, mock_locations):
        # Setup mocks
        mock_loc_doc = MagicMock()
        mock_loc_doc.get.return_value.to_dict.return_value = {
            "location_name": "Test Loc", "max_players": 10, "sport_type": "Soccer"
        }
        mock_locations.document.return_value = mock_loc_doc
        
        mock_player_doc = MagicMock()
        mock_player_doc.get.return_value.to_dict.return_value = {"upcoming_games": []}
        mock_players.document.return_value = mock_player_doc
        
        mock_in_memory.get.return_value.to_dict.return_value = {"storage": []}

        # Run creation
        result = model_games.create_game(self.game_data_valid)

        # Assertions
        self.assertIn("sucess", result)
        # Verify db calls
        mock_games.document.assert_called()
        mock_games.document.return_value.set.assert_called()
        
    def test_create_game_invalid_input(self):
        # Test missing fields, should fail
        invalid_data = {'title': 'Missing Fields'}
        result = model_games.create_game(invalid_data)
        self.assertIn('error', result)
        
        # Test not a dict, should fail(wrong structure)
        result = model_games.create_game("not a dict")
        self.assertIn('error', result)

    @patch('api.model_games.games')
    @patch('api.model_games.players')
    def test_join_game(self, mock_players, mock_games):
        game_id = "game_123"
        player_id = "player_456"
        
        # Mock game data
        mock_game_doc = MagicMock()
        mock_game_doc.get.return_value.to_dict.return_value = {"roster": []}
        mock_games.document.return_value = mock_game_doc
        
        # Mock player data
        mock_player_doc = MagicMock()
        mock_player_doc.get.return_value.to_dict.return_value = {"upcoming_games": []}
        mock_players.document.return_value = mock_player_doc
        
        result = model_games.join_game(game_id, player_id)
        
        self.assertIn("sucess", result)
        mock_games.document.return_value.update.assert_called()
        # Verify roster update args contains new player
        call_args = mock_games.document.return_value.update.call_args[0][0]
        self.assertTrue(any(d.get('player_id') for d in call_args['roster']))

    @patch('api.model_games.games')
    @patch('api.model_games.players')
    def test_leave_game(self, mock_players, mock_games):
        game_id = "game_123"
        player_id = "player_456"
        
        # Mock setup: Player IS in the roster
        mock_player_ref = MagicMock()
        mock_player_ref.id = player_id
        
        roster = [{'player_id': mock_player_ref, 'joined_at': 'yesterday'}]
        
        mock_game_doc = MagicMock()
        mock_game_doc.get.return_value.to_dict.return_value = {"roster": roster}
        mock_games.document.return_value = mock_game_doc
        
        mock_players.document.return_value = mock_player_ref
        mock_player_ref.get.return_value.to_dict.return_value = {"upcoming_games": []}

        result = model_games.leave_game(game_id, player_id)
        
        self.assertIn("sucess", result)
        # Verify update was called with empty roster (since we removed the only player)
        mock_games.document.return_value.update.assert_called()
        call_args = mock_games.document.return_value.update.call_args[0][0]
        self.assertEqual(len(call_args['roster']), 0)

    @patch('api.model_games.games')
    def test_list_games(self, mock_games):
        # Mock stream results
        mock_doc = MagicMock()
        mock_doc.id = "game_1"
        mock_doc.to_dict.return_value = {"title": "Game 1", "status": "scheduled"}
        
        mock_games.where.return_value.stream.return_value = [mock_doc]
        
        games_list = model_games.list_games()
        
        self.assertEqual(len(games_list), 1)
        self.assertEqual(games_list[0]['id'], "game_1")
        self.assertEqual(games_list[0]['title'], "Game 1")

class PlayerTests(TestCase):
    
    @patch('api.model_players.auth')
    def test_create_firebase_user_success(self, mock_auth):
        mock_user = MagicMock()
        mock_user.uid = "new_user_123"
        mock_auth.create_user.return_value = mock_user
        
        user = model_players.create_firebase_user("test@example.com", "password")
        
        self.assertEqual(user.uid, "new_user_123")
        mock_auth.create_user.assert_called_with(email="test@example.com", password="password")

    @patch('api.model_players.auth')
    def test_create_firebase_user_failure(self, mock_auth):
        mock_auth.create_user.side_effect = Exception("Firebase Error")
        
        user = model_players.create_firebase_user("test@example.com", "password")
        
        self.assertIsNone(user)

    @patch('api.model_players.db_players')
    def test_add_user_profile(self, mock_db_players):
        uid_mock = MagicMock()
        uid_mock.uid = "user_123"
        
        model_players.add_user_profile(uid_mock, "Test User", "test@example.com")
        
        mock_db_players.document.assert_called_with("user_123")
        mock_db_players.document.return_value.set.assert_called()
        call_args = mock_db_players.document.return_value.set.call_args[0][0]
        self.assertEqual(call_args['name'], "Test User")

    @patch('api.model_players.db_players')
    def test_get_user_profile_exists(self, mock_db_players):
        mock_doc = MagicMock()
        mock_doc.exists = True
        mock_doc.to_dict.return_value = {"name": "Test User"}
        
        mock_db_players.document.return_value.get.return_value = mock_doc
        
        profile = model_players.get_user_profile("user_123")
        
        self.assertEqual(profile['name'], "Test User")

    @patch('api.model_players.db_players')
    def test_get_user_profile_not_exists(self, mock_db_players):
        mock_doc = MagicMock()
        mock_doc.exists = False
        
        mock_db_players.document.return_value.get.return_value = mock_doc
        
        profile = model_players.get_user_profile("user_123")
        
        self.assertIsNone(profile)

    @patch('api.model_players.db_players')
    def test_update_user_profile(self, mock_db_players):
        update_data = {"name": "Updated Name"}
        model_players.update_user_profile("user_123", update_data)
        
        mock_db_players.document.assert_called_with("user_123")
        mock_db_players.document.return_value.update.assert_called_with(update_data)