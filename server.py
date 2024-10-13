from datetime import datetime, timezone
from flask import Flask, request

from scan_localiser import GlobalLocaliser, hash_network

app = Flask(__name__)

localiser = GlobalLocaliser()


@app.route('/location', methods=['POST'])
def handle_json():
    if request.is_json:
        data = request.json
        print(f'lat: {data.get('lat')} long: {data.get('long')}')
        localiser.scan_and_update((data.get('lat'), data.get('long')))
        print(localiser)
        return data
    else:
        return "Content type is not supported."

@app.route('/save', methods=['POST'])
def save():
    filename = datetime.now(timezone.utc).strftime("%Y-%m-%d-%H-%M-%S") + ".json"
    localiser.save(filename=filename)
    print(f'Saved {filename}')
    return "Saved"

@app.route('/clear', methods=['POST'])
def clear():
    localiser.hash_dict = {}
    print('Cleared')
    return "Cleared"

@app.route("/")
def landing():
    return app.send_static_file('location.html')
