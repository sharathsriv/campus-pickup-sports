from django.urls import path
from .views import (
    PlayersAccountControllAPIView,
    PlayersAccountAPIView,
    GamesListCreateAPIView,
    JoinGameAPIView,
    LeaveGameAPIView,
    PlayerLookupByEmailAPIView,
)

urlpatterns = [
    path('players/', PlayersAccountControllAPIView.as_view(), name='players-account'),
    path('players/by-email/', PlayerLookupByEmailAPIView.as_view(), name='players-by-email'),
    path('players/account/<str:player_id>/', PlayersAccountAPIView.as_view(), name='players-account-detail'),
    path('games/', GamesListCreateAPIView.as_view(), name='games-list-create'),            
    path('games/<str:game_id>/', GamesListCreateAPIView.as_view(), name='game-list-detail'), 
    path('games/<str:game_id>/join/', JoinGameAPIView.as_view(), name='games-join'),
    path('games/<str:game_id>/leave/', LeaveGameAPIView.as_view(), name='games-leave'),
]