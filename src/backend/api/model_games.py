from datetime import datetime, UTC
from . import input_validator, firebase_auth
import hashlib
from firebase_admin import auth, firestore

db = firestore.client()
players = db.collection('players')
games = db.collection('games')
locations = db.collection('locations')

def generate_id(created_by, created_at):
    hash_input = f"{created_by}-{created_at}".encode('utf-8')
    hash_output = hashlib.sha256(hash_input).hexdigest()
    return hash_output


def create_game(data):
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
    
    try:
        location_id = data.get("location_id")
        location_details = locations.document(location_id).get().to_dict()
        doc_id = str(generate_id(data.get("created_by"), datetime.now(UTC)))
        doc_ref = games.document(doc_id)
        doc = {
            "created_at": datetime.now(UTC),
            "start_time": datetime.fromisoformat(data.get("start_time")),
            "end_time": datetime.fromisoformat(data.get("start_time")),  
            "title": data.get("title"),
            "created_by": players.document(data.get("created_by")), 
            "roster": [{
                'player_id': players.document(data.get("created_by")),
                'joined_at': datetime.now(UTC),
                }],
            "status": "scheduled",
            "location_id": location_id,
            "location_name": location_details.get("location_name"),
            "max_players": location_details.get("max_players"),
            "sport_type": location_details.get("sport_type"),
        }
        doc_ref.set(doc)
    except Exception as e:
        return {"error": str(e)}
    else:
        player_doc_ref = players.document(data.get("created_by"))
        player_doc = player_doc_ref.get().to_dict()
        upcoming_games = player_doc.get("upcoming_games", [])
        upcoming_games.append(doc_ref)
        player_doc_ref.update({"upcoming_games": upcoming_games})
        return {"sucess": doc_id }

def get_game(game_id):
    '''
    The function retrieves a game document by its ID.
    Args:
        game_id (str): The ID of the game to retrieve.
    Returns:
        dict or None: The game document if found, otherwise None.
    '''
    if game_id is None:
        return None
    return games.document(game_id).get().to_dict()


def list_games(status_list=["scheduled", "ongoing"]):
    query = games.where("status", "in", status_list)
    results = query.stream()

    out = []
    for doc in results:
        d = doc.to_dict()
        d["id"] = doc.id  # Firestore uses doc.id instead of _id
        out.append(d)

    return out

def join_game(game_id, player_id):
    """
    Add a player to the roster if space available and not already in roster.
    Returns updated doc or error.
    """
    game_ref = games.document(game_id)
    game_doc = game_ref.get()
    if not game_doc.exists:
        return {"error": "Game not found"}

    game_data = game_doc.to_dict()
    if game_data["status"] != "scheduled":
        return {"error": "Cannot join a game that is not scheduled"}

    roster = game_data.get("roster", [])
    if any(player['player_id'].id == player_id for player in roster):
        return {"error": "Player already in roster"}

    if len(roster) >= game_data["max_players"]:
        return {"error": "Game is full"}

    player_ref = players.document(player_id)
    if not player_ref.get().exists:
        return {"error": "Player not found"}
    
    player_ref_data = player_ref.get().to_dict()
    ongoing_games = player_ref_data.get("ongoing_games", []) + player_ref_data.get("upcoming_games", [])
    for game_ref_in_list in ongoing_games:
        game_in_list = game_ref_in_list.get().to_dict()
        if not (game_data["end_time"] <= game_in_list["start_time"] or game_data["start_time"] >= game_in_list["end_time"]):
            return {"error": "Player has a conflicting game at the same time"}

    roster.append({
        'player_id': players.document(player_id),
        'joined_at': datetime.now(UTC),
    })
    game_ref.update({"roster": roster})
    
    scheduled_games = player_ref_data.get("upcoming_games", [])
    scheduled_games.append(game_ref)
    player_ref.update({"upcoming_games": scheduled_games})

    return {"sucess":game_id}
