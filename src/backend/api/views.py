from django.shortcuts import render

# Create your views here.
# api/views.py
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from . import models_game

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
#         games = models_game.list_games(filter_q)
#         return Response(games)

#     def post(self, request):
#         ser = CreateGameSerializer(data=request.data)
#         if not ser.is_valid():
#             return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
#         created_id = models_game.create_game(ser.validated_data)
#         return Response({"id": created_id}, status=status.HTTP_201_CREATED)

# # class JoinGameAPIView(APIView):
# #     """
# #     POST /api/games/{game_id}/join/  -> payload: { "player_id": "<playerId>" }
# #     """
# #     def post(self, request, game_id):
# #         player_id = request.data.get("player_id")
# #         if not player_id:
# #             return Response({"error": "player_id required"}, status=status.HTTP_400_BAD_REQUEST)
# #         res = models_game.join_game(game_id, player_id)
# #         if "error" in res:
# #             return Response(res, status=status.HTTP_400_BAD_REQUEST)
# #         return Response(res)
