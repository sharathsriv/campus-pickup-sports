from datetime import datetime, timezone as dt_timezone, UTC

class validator:
    '''
    This class is used to validate input data for creating/joining/leaving a game.
    Methods:
        validate_create_game(data): Validates data for creating a game.
        validate_join_game(data): Validates data for joining a game.
        validate_leave_game(data): Validates data for leaving a game.
    '''
    @staticmethod
    def validate_create_game(data, locations, players, games_store = None):
        '''
        Checks:
            input
                - required fields are present
                - field types are correct
                - make sure that loaction_id exists in locations collection
                - make sure player_id exists in players collection
                - check that start_time and end_time are valid ISO strings that can be parsed as datetime                    
            logic
                - start_time is before end_time
                - game length is a max of 2 hours   
                - check start time is after current time
                - no other games at the same location and time
                - user can't create two games at the same time
        
        '''
        required_fields = ["start_time", "end_time", "title", "location_id", "created_by"]
        # Sanity checks: We have all the required fields
        for field in required_fields:
            if field not in data:
                return False, f"Missing required field: {field}"
            if not isinstance(data[field], str):
                return False, f"Field {field} must be a string"
        
        # Sanity checks: location_id exists
        if not locations.document(data["location_id"]).get().exists:
            return False, "Invalid location_id: Location does not exist"
        
        # Sanity checks: created_by exists
        if not players.document(data["created_by"]).get().exists:
            return False, "Invalid created_by: Player does not exist"
        
        # Sanity checks: start_time and end_time are valid ISO strings
        try:
            start_time = datetime.fromisoformat(data["start_time"])
            end_time = datetime.fromisoformat(data["end_time"])
        except ValueError:
            return False, "start_time and end_time must be valid ISO datetime strings"
        
        # Logic checks: Start time is before end time
        if start_time >= end_time:
            return False, "start_time must be before end_time"
        
        # Logic checks: Game length is a max of 2 hours
        game_length = end_time - start_time
        if game_length.total_seconds() > 2 * 3600:
            return False, "Game length cannot exceed 2 hours"
        
        # Logic checks: Start time is after current time
        if start_time <= datetime.now(dt_timezone.utc):
            return False, "start_time must be in the future"
        
        # Logic checks: User can't create two games at the same time
        player_data = players.document(data["created_by"]).get().to_dict()
        ongoing_games = player_data.get("ongoing_games", []) + player_data.get("upcoming_games", [])
        for game_ref in ongoing_games:
            game = game_ref.get().to_dict()
            
            if not (end_time <= game["start_time"] or start_time >= game["end_time"]):
                return False, "User cannot create two games that overlap in time"
        
        # Logical checks: No other games at the same location and time
        #### To be implemented: Check in DB for conflicting games ####
        
        
        return True, "Valid data"
    
    @staticmethod
    def validate_join_game(game_id, player_id, locations, players, games):
        game_ref = games.document(game_id)
        game_doc = game_ref.get()
        # Check if game exists
        if not game_doc.exists:
            return False, "Game not found"

        # Check if the game is scheduled
        game_data = game_doc.to_dict()
        if game_data["status"] != "scheduled":
            return False, "Cannot join a game that is not scheduled"

        # Check if the player isn't already in the roster
        roster = game_data.get("roster", [])
        if any(player['player_id'].id == player_id for player in roster):
            return False, "Player already in roster"

        # Make sure game has space
        if len(roster) >= game_data["max_players"]:
            return False, "Game is full"

        # Check if we have the player
        player_ref = players.document(player_id)
        if not player_ref.get().exists:
            return False, "Player not found"
        
        # Making sure the player doesn't have a conflicting game
        player_ref_data = player_ref.get().to_dict()
        ongoing_games = player_ref_data.get("ongoing_games", []) + player_ref_data.get("upcoming_games", [])
        for game_ref_in_list in ongoing_games:
            game_in_list = game_ref_in_list.get().to_dict()
            if not (game_data["end_time"] <= game_in_list["start_time"] or game_data["start_time"] >= game_in_list["end_time"]):
                return False, "Player has a conflicting game at the same time"

        # make sure that game start date is after the current time
        if datetime.fromisoformat(str(game_data.get("start_time"))) <= datetime.now(UTC):
            return False, "Can only join scheduled games"

        return True, game_id
        
    @staticmethod
    def validate_leave_game(game_id, player_id, locations, players, games):
        
        game_ref = games.document(game_id)
        game_doc = game_ref.get()
        # Checking if the game exists
        if not game_doc.exists:
            return False, "Game not found"

        # Check if the game is scheduled
        game_data = game_doc.to_dict()
        if game_data["status"] != "scheduled":
            return False, "Cannot leave a game that is not scheduled"

        # Check if the player exists
        player_ref = players.document(player_id)
        if not player_ref.get().exists:
            return False, "Player not found"

        # Making sure player is in the roster to remove
        roster = game_data.get("roster", [])
        if not any(player['player_id'].id == player_id for player in roster):
            return False, "Player not in roster"

        return True, game_id
    