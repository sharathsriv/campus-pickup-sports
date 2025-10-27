# Games
When we create a game, this is the following data that is expected from the front end:

    data is a dict with the following keys and their types:
        start_time (str): that can be parsed as datetime Note this is going to be ISO
        end_time (str): that can be parsed as datetime Note this is going to be ISO
        game_title (str): title of the game
        location_id (str): id of the location
        created_by (str): user id of the creator

### Create
```
{
    'start_time': '2024-07-01T10:00:00Z',
    'end_time': '2024-07-01T12:00:00Z',
    'title': 'Morning Soccer Match',
    'location_id': '1',
    'created_by': '650f1c2e4f1a2567eb8d9c3a',
}
```

Makes
```
{
    "created_at":{
        "$date":{"$numberLong":"1761547650501"}
        },
    "start_time":"2024-07-01T10:00:00Z",
    "sport_type":"Basketball",
    "created_by":{"$oid":"650f1c2e4f1a2567eb8d9c3a"},
    "roster":[{
        "player_id":{"$oid":"650f1c2e4f1a2567eb8d9c3a"},"joined_at":
        {
            "$date":{"$numberLong":"1761547650501"}
        }
    }],
    "location_name":"Sylvan Court 1",
    "location_id":{"$numberInt":"1"},
    "title":"Morning Soccer Match",
    "end_time":"2024-07-01T12:00:00Z",
    "max_players":{"$numberInt":"10"},
    "status":"scheduled",
    "_id":{"$oid":"7772a6c46883ac043dbd7b72"}
    }
```