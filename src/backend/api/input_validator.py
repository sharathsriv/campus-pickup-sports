from datetime import datetime

class validator:
    '''
    This class is used to validate input data for creating/joining/leaving a game.
    Methods:
        validate_create_game(data): Validates data for creating a game.
        validate_join_game(data): Validates data for joining a game.
        validate_leave_game(data): Validates data for leaving a game.
    '''
    @staticmethod
    def validate_create_game(data, games_store, locations, players):
        '''
        Checks:
            input
                - required fields are present
                - field types are correct
                - make sure that loaction_id exists in locations collection
                - make sure player_id exists in players collection
                - check that start_time and end_time are valid ISO strings that can be parsed as datetime                    
                - check start time is after current time
            logic
                - start_time is before end_time
                - game length is a max of 2 hours   
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
        location = locations.find_one({"_id": str(data["location_id"])})
        if not location:
            return False, "Invalid location_id: Location does not exist"
        
        # Sanity checks: created_by exists
        player = players.find_one({"_id": str(data["created_by"])})
        if not player:
            return False, "Invalid created_by: Player does not exist"
        
        # Sanity checks: start_time and end_time are valid ISO strings
        try:
            data["start_time"] = datetime.fromisoformat(data["start_time"])
            data["end_time"] = datetime.fromisoformat(data["end_time"])
        except ValueError:
            return False, "start_time and end_time must be valid ISO datetime strings"
        
        # Logic checks: Start time is before end time
        if data["start_time"] >= data["end_time"]:
            return False, "start_time must be before end_time"
        
        # Logic checks: Game length is a max of 2 hours
        game_length = data["end_time"] - data["start_time"]
        if game_length.total_seconds() > 2 * 3600:
            return False, "Game length cannot exceed 2 hours"
        
        # Logical checks: No other games at the same location and time
        #### To be implemented: Check in DB for conflicting games ####
        
        # Logic checks: User can't create two games at the same time
        #### To be implemented: Check in DB for user's other games ####
        
        
        return True, "Valid data"