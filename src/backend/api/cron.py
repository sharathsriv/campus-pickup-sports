from datetime import datetime, UTC, timezone, timedelta
from . import input_validator, firebase_auth
from firebase_admin import auth, firestore
from django.core.mail import send_mail

db = firestore.client()
players = db.collection('players')
games = db.collection('games')
locations = db.collection('locations')
in_memory = db.collection('in_memory')
in_memory_ongoing = in_memory.document('ongoing')
in_memory_scheduled = in_memory.document('scheduled')

def check_game_status():
    current_time = datetime.now(timezone.utc)
    # Remove any games that are completed in the ongoing
    scheduled_games = in_memory_scheduled.get().to_dict().get("storage", [])
    ongoing_games = in_memory_ongoing.get().to_dict().get("storage", [])
    new_scheduled, new_ongoing = [], []
    
    for game_ref in ongoing_games:
        # Get this game's end time and comapare to current time
        game_doc = games.document(game_ref).get()
        if not game_doc.exists:
            continue
        game = game_doc.to_dict()
        end_time = game.get("end_time")
        # If the game is still ongoing, keep it
        if current_time < end_time:
            new_ongoing.append(game_ref)
        else:
            # For games that are not in ongoing rn, change the game status to completed, and add the game to all the player's in the roster's past games
            games.document(game_ref).update({"status": "completed"})
            
            player_ids = game.get("players", [])
            for pid in player_ids:
                player_doc_ref = players.document(pid)
                player_doc = player_doc_ref.get()
                if not player_doc.exists:
                    continue

                # Update past_games
                past_games = player_doc.to_dict().get("past_games", [])
                if game_ref not in past_games:
                    past_games.append(game_ref)
                
                # Remove from ongoing_games
                ongoing_games_list = player_doc.to_dict().get("ongoing_games", [])
                if game_ref in ongoing_games_list:
                    ongoing_games_list.remove(game_ref)

                # Save updates
                player_doc_ref.update({
                    "past_games": past_games,
                    "ongoing_games": ongoing_games_list
                })

    for game_ref in scheduled_games:
        game_doc = games.document(game_ref).get()
        if not game_doc.exists:
            continue 
        
        game = game_doc.to_dict()
        start_time = game.get("start_time")
        end_time = game.get("end_time")
        if start_time <= current_time < end_time:
            # Move to ongoing
            new_ongoing.append(game_ref)
            # Change the games status to on going and all the player's game to ongoing_games
            player_ids = game.get("players", [])
            for pid in player_ids:
                player_doc_ref = players.document(pid)
                player_doc = player_doc_ref.get()
                if not player_doc.exists:
                    continue
                # update player's ongoing
                ongoing_games_list = player_doc.to_dict().get("ongoing_games", [])
                if game_ref not in ongoing_games_list:
                    ongoing_games_list.append(game_ref)
                # Update scheduled_games
                upcoming_games = player_doc.to_dict().get("upcoming_games", [])
                if game_ref in upcoming_games:
                    upcoming_games.remove(game_ref)
                
                player_doc_ref.update({
                    "upcoming_games": upcoming_games,
                    "ongoing_games": ongoing_games_list
                })
                
        elif current_time < start_time:
            # Keep in scheduled
            new_scheduled.append(game_ref)

    # Save updated in-memory collections
    in_memory_scheduled.set({"storage": new_scheduled})
    in_memory_ongoing.set({"storage": new_ongoing})

def email_upcoming_games():
    current_time = datetime.now(timezone.utc)
    window_end = current_time + timedelta(minutes=30)

    # Query games starting in the next 30 minutes
    games_snapshot = games.stream()
    for game_doc in games_snapshot:
        game = game_doc.to_dict()
        start_time = game.get("start_time")
        if start_time and current_time <= start_time <= window_end:
            # Get player emails
            player_ids = game.get("players", [])
            emails = []
            for pid in player_ids:
                player_doc = players.document(pid).get()
                if player_doc.exists:
                    player_data = player_doc.to_dict()
                    email = player_data.get("email")
                    if email:
                        emails.append(email)
            
            # Send email to all players
            if emails:
                send_mail(
                    subject=f"Your game {game.get("title")} starts soon!",
                    message=f"Your game is scheduled to start at {start_time.isoformat()} in {game.get("location_name")}. Get ready!",
                    from_email="settings.EMAIL_HOST_USER", # FIXME: Change email id
                    recipient_list=emails,
                    fail_silently=True,  
                )
                print(f"Sent reminders for game {game_doc.id} to {len(emails)} players")