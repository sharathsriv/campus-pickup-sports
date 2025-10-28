from db import get_collection, to_objectid, generate_id
from datetime import datetime, UTC
import input_validator

games = get_collection("games")
games_today = get_collection("games_today")
locations = get_collection("locations")
players = get_collection("players")
validator = input_validator.validator()

def create_game(data, games_store):
    """
    data is a dict with the following keys and their types:
        start_time (str): that can be parsed as datetime
        end_time (str): that can be parsed as datetime
        game_title (str): title of the game
        location_id (str): id of the location
        created_by (str): user id of the creator
    """
    if not isinstance(data, dict):
        return {"error": "invalid data format"}
    
    is_valid, msg = validator.validate_create_game(data, games_store, locations, players)
    if not is_valid:
        return {"error": msg}
    
    try:
        # normalize & add fields
        location_id = data.get("location_id")
        location_details = locations.find_one({"_id": str(location_id)})
        
        doc = {
            "_id": generate_id(data.get("created_by"), datetime.now(UTC)),
            "created_at": datetime.now(UTC),
            "start_time": datetime.fromisoformat(data.get("start_time")),
            "end_time": datetime.fromisoformat(data.get("start_time")),  
            "title": data.get("title"),
            "created_by": to_objectid(data.get("created_by")), 
            "roster": [{
                'player_id': to_objectid(data.get("created_by")),
                'joined_at': datetime.now(UTC),
                }],
            "status": "scheduled",
            "location_id": location_id,
            "location_name": location_details.get("location_name"),
            "max_players": location_details.get("max_players"),
            "sport_type": location_details.get("sport_type"),
        }
    except Exception as e:
        return {"error": str(e)}
    else:
        result = games.insert_one(doc)
        return {"sucess": str(result.inserted_id) }


def get_game(game_id):
    '''
    The function retrieves a game document by its ID.
    Args:
        game_id (str): The ID of the game to retrieve.
    Returns:
        dict or None: The game document if found, otherwise None.
    '''
    oid = to_objectid(game_id)
    if oid is None:
        return None
    doc = games.find_one({"_id": oid})
    if doc:
        doc["_id"] = str(doc["_id"])
    return doc

def list_games(filter={"status": {"$in": ["scheduled", "ongoing"]}}):
    cursor = games.find(filter)
    out = []
    for d in cursor:
        d["_id"] = str(d["_id"])
        out.append(d)
    return out

# def join_game(game_id, player_id):
#     """
#     Add a player to the roster if space available and not already in roster.
#     Returns updated doc or error.
#     """
#     oid = to_objectid(game_id)
#     pid = to_objectid(player_id)
#     if not oid or not pid:
#         return {"error": "invalid ids"}

#     # atomic check-and-update:
#     # only push if roster length < max_players and player not already in roster
#     # Mongo query uses $expr to compare sizes (requires Mongo 3.6+)
#     query = {
#         "_id": oid,
#         "status": "scheduled",
#         "$expr": {"$lt": [{"$size": "$roster"}, "$max_players"]},
#         "roster.player_id": {"$ne": pid}  # ensure not present
#     }
#     update = {
#         "$push": {"roster": {"player_id": pid, "joined_at": datetime.utcnow().isoformat(), "role": "player"}}
#     }
#     res = games.update_one(query, update)
#     if res.modified_count == 0:
#         return {"error": "could not join (full, cancelled, or already joined)"}
#     return get_game(game_id)
