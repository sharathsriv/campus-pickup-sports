from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . import model_games, model_players
from firebase_admin import firestore, auth
from . import input_validator
import json

validator = input_validator.validator()
db = firestore.client()
players = db.collection('players')
games = db.collection('games')
locations = db.collection('locations')

class PlayersAccountControllAPIView(APIView):
    """
    GET /api/players/?token=<idToken> -> get account uid
    POST /api/players/ -> create new player
    """
    def get(self, request):
        token = request.query_params.get("token")
        if not token:
            return Response({"error": "token required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            player_id = model_players.user_login(token)
        except Exception:
            return Response({"error": "Player not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"uid": player_id})

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        name = request.data.get("name")
        if not (email and password and name):
            return Response({"error": "email, password, and name required"}, status=status.HTTP_400_BAD_REQUEST)
        user = model_players.create_firebase_user(email, password)
        if user is None:
            return Response({"error": "Failed to create user"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        model_players.add_user_profile(user, name, email)
        return Response({"uid": user.uid}, status=status.HTTP_201_CREATED)

class PlayerLookupByEmailAPIView(APIView):
    """
    GET /api/players/by-email/?email=<email> -> returns uid if found
    """
    def get(self, request):
        email = request.query_params.get("email")
        if not email:
            return Response({"error": "email required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = auth.get_user_by_email(email)
            return Response({"uid": user.uid}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Player not found"}, status=status.HTTP_404_NOT_FOUND)

class PlayersAccountAPIView(APIView):
    """
    GET /api/players/account/{player_id}/ -> get player details
    POST /api/players/account/{player_id}/ -> update player name/email
    """
    def get(self, request, player_id):
        player_doc = model_players.get_user_profile(player_id)
        if player_doc is None:
            return Response({"error": "Player not found"}, status=status.HTTP_404_NOT_FOUND)
        res = {
            "id": player_id,
            "name": player_doc.get("name"),
            "email": player_doc.get("email"),
            "past_games": [game.id for game in player_doc.get("past_games", [])],
            "ongoing_games": [game.id for game in player_doc.get("ongoing_games", [])],
            "upcoming_games": [game.id for game in player_doc.get("upcoming_games", [])],
        }
        return Response(res, status=status.HTTP_200_OK)

    def post(self, request, player_id):
        player_doc = model_players.get_user_profile(player_id)
        if player_doc is None:
            return Response({"error": "Player not found"}, status=status.HTTP_404_NOT_FOUND)
        name = request.data.get("name")
        email = request.data.get("email")
        update_data = {}
        if name:
            update_data['name'] = name
        if email:
            update_data['email'] = email
        if update_data:
            model_players.update_user_profile(player_id, update_data)
        return Response({"success": "Player profile updated"})

class GamesListCreateAPIView(APIView):
    """
    GET /api/games/ -> list games
    GET /api/games/{game_id}/ -> game detail
    POST /api/games/ -> create game
    """
    def get(self, request, game_id=None):
        if game_id:
            game = model_games.get_game(game_id)
            if not game:
                return Response({"error": "Game not found"}, status=status.HTTP_404_NOT_FOUND)
            res = {
                "id": game_id,
                "created_at": game["created_at"].isoformat(),
                "start_time": game["start_time"].isoformat(),
                "end_time": game["end_time"].isoformat(),
                "title": game["title"],
                "created_by": game["created_by"].id,
                "roster": [{
                    "player_id": player['player_id'].id,
                    "joined_at": player['joined_at'].isoformat()
                } for player in game.get("roster", [])],
                "status": game["status"],
                "location_id": game["location_id"],
                "location_name": game["location_name"],
                "max_players": game["max_players"],
                "sport_type": game["sport_type"],
            }
            return Response(res, status=status.HTTP_200_OK)
        # list
        games_list = model_games.list_games()
        out = []
        for g in games_list:
            out.append({
                "id": g["id"],
                "created_at": g["created_at"].isoformat(),
                "start_time": g["start_time"].isoformat(),
                "end_time": g["end_time"].isoformat(),
                "title": g["title"],
                "created_by": g["created_by"].id,
                "roster": [{
                    "player_id": p['player_id'].id,
                    "joined_at": p['joined_at'].isoformat()
                } for p in g.get("roster", [])],
                "status": g["status"],
                "location_id": g["location_id"],
                "location_name": g["location_name"],
                "max_players": g["max_players"],
                "sport_type": g["sport_type"],
            })
        return Response(out, status=status.HTTP_200_OK)

    def post(self, request):
        data = json.loads(request.body)
        is_valid, msg = validator.validate_create_game(data, locations, players)
        if not is_valid:
            return Response({"error": msg}, status=status.HTTP_400_BAD_REQUEST)
        game_response = model_games.create_game(data)
        if "error" in game_response:
            return Response(game_response, status=status.HTTP_400_BAD_REQUEST)
        created_id = game_response.get("sucess")
        return Response({"id": created_id}, status=status.HTTP_201_CREATED)

class JoinGameAPIView(APIView):
    def post(self, request, game_id):
        player_id = request.data.get("player_id")
        if not player_id:
            return Response({"error": "player_id required"}, status=status.HTTP_400_BAD_REQUEST)
        is_valid, msg = validator.validate_join_game(game_id, player_id, locations, players, games)
        if not is_valid:
            return Response({"error": msg}, status=status.HTTP_400_BAD_REQUEST)
        res = model_games.join_game(game_id, player_id)
        if "error" in res:
            return Response(res, status=status.HTTP_400_BAD_REQUEST)
        return Response({"success": f"Player {player_id} joined game {game_id}"}, status=status.HTTP_200_OK)

class LeaveGameAPIView(APIView):
    def post(self, request, game_id):
        player_id = request.data.get("player_id")
        if not player_id:
            return Response({"error": "player_id required"}, status=status.HTTP_400_BAD_REQUEST)
        is_valid, msg = validator.validate_leave_game(game_id, player_id, locations, players, games)
        if not is_valid:
            return Response({"error": msg}, status=status.HTTP_400_BAD_REQUEST)
        res = model_games.leave_game(game_id, player_id)
        if "error" in res:
            return Response(res, status=status.HTTP_400_BAD_REQUEST)
        return Response({"success": f"Player {player_id} left game {game_id}"}, status=status.HTTP_200_OK)