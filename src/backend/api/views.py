from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . import model_games, model_players

class PlayersAccountControllAPIView(APIView):
    """
    GET /api/players/token  -> get account uid, and account details
    """
    def get(self, request, token):
        # token = request.query_params.get("token")
        # if not token:
        #     return Response({"error": "token required"}, status=status.HTTP_400_BAD_REQUEST)
        player_id = model_players.user_login(token)
        player_doc = model_players.get_player(player_id)
        player_doc['id'] = player_id
        if player_doc is None:
            return Response({"error": "Player not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(player_doc)
    """
    POST /api/sign_up/  -> create new player account
    """
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        name = request.data.get("name")
        if not email or not password or not name:
            return Response({"error": "email, password, and name are required"}, status=status.HTTP_400_BAD_REQUEST)
        user = model_players.create_firebase_user(email, password)
        if user is None:
            return Response({"error": "Failed to create user"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        model_players.add_user_profile(user, name, email)
        return Response({"uid": user.uid}, status=status.HTTP_201_CREATED)

class PlayersAccountAPIView(APIView):
    """
    GET /api/players/{player_id}/  -> get player details
    """
    def get(self, request, player_id):
        player_doc = model_players.get_user_profile(player_id)
        if player_doc is None:
            return Response({"error": "Player not found"}, status=status.HTTP_404_NOT_FOUND)
        player_doc['id'] = player_id
        return Response(player_doc)
    """
    POST /api/players/{player_id}/  -> update player details
    """
    def post(self, request, player_id):
        player_doc = model_players.get_user_profile(player_id)
        if player_doc is None:
            return Response({"error": "Player not found"}, status=status.HTTP_404_NOT_FOUND)
        name = request.data.get("name")
        email = request.data.get("email")
        update_data = {}
        if name:
            update_data['name'] = name
        if update_data:
            model_players.update_user_profile(player_id, update_data)
        return Response({"success": "Player profile updated"})

# class GamesListCreateAPIView(APIView):
#     """
#     GET /api/games/   -> list games
#     POST /api/games/  -> create game
#     """
#     def get(self, request):
#         # optional filter params: sport, time range, etc.
#         filter_q = {}
#         sport = request.query_params.get("sport")
#         if sport:
#             filter_q["sport"] = sport
#         games = model_games.list_games(filter_q)
#         return Response(games)

#     def post(self, request):
#         ser = CreateGameSerializer(data=request.data)
#         if not ser.is_valid():
#             return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
#         created_id = models_game.create_game(ser.validated_data)
#         return Response({"id": created_id}, status=status.HTTP_201_CREATED)

# class JoinGameAPIView(APIView):
#     """
#     POST /api/games/{game_id}/join/  -> payload: { "player_id": "<playerId>" }
#     """
#     def post(self, request, game_id):
#         player_id = request.data.get("player_id")
#         if not player_id:
#             return Response({"error": "player_id required"}, status=status.HTTP_400_BAD_REQUEST)
#         res = models_game.join_game(game_id, player_id)
#         if "error" in res:
#             return Response(res, status=status.HTTP_400_BAD_REQUEST)
#         return Response(res)
