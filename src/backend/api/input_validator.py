class validator:
    '''
    This class is used to validate input data for creating/joining/leaving a game.
    Methods:
        validate_create_game(data): Validates data for creating a game.
        validate_join_game(data): Validates data for joining a game.
        validate_leave_game(data): Validates data for leaving a game.
    '''
    @staticmethod
    def validate_create_game(data):
        '''
        Checks:
        - required fields are present
        - field types are correct
        - logical consistency (e.g., start_time < end_time)
        - No other games at the same location and time
        - Make sure that loaction_id exists in locations collection
        - user can't create two games at the same time
        - Make sure player_id exists in players collection
        - Check that start_time and end_time are valid ISO strings that can be parsed as datetime
        '''
        required_fields = ["start_time", "end_time", "title", "location_id", "created_by"]
        
        # Sanity checks: We have all the required fields
        for field in required_fields:
            if field not in data:
                return False, f"Missing required field: {field}"
        
        # Logic checks: Start time is before end time
        if data["start_time"] >= data["end_time"]:
            return False, "start_time must be before end_time"
        
        # Logical checks: No other games at the same location and time
        #### To be implemented: Check in DB for conflicting games ####
        
        
        
        return True, "Valid data"