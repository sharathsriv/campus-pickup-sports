import model_games


# Create a game
game_id = model_games.create_game({
    'start_time': '2024-07-01T10:00:00Z',
    'end_time': '2024-07-01T12:00:00Z',
    'title': 'Morning Soccer Match',
    'location_id': '1',
    'created_by': '68feebb3b073f773742b4e37',
})

# TEST VALIDATOR to make sure it rejects invalid data:
    # Create another game at same location and time to test conflict
    # Create a game with same time for the same user to test conflict
    # start time >= end_time
    # Wrong data types
    # Missing required fields
    # Non-existent location_id
    # user doesn't exist

# Join a new game
# Leave a game
# List games
# List roster for a game
# Get game details
# delete the created game