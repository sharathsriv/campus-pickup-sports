from django.urls import path
from .views import PlayersAccountControllAPIView, PlayersAccountAPIView

urlpatterns = [
    path('players/', PlayersAccountControllAPIView.as_view(), name='players-account'),
    path('players/account/<str:player_id>/', PlayersAccountAPIView.as_view(), name='players-account-detail'),
    # path('games/', GamesListCreateAPIView.as_view(), name='games-list-create'),
    # path('games/<str:game_id>/join/', JoinGameAPIView.as_view(), name='games-join'),
]
