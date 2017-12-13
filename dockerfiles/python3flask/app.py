from flask import Flask
app = Flask(__name__)
@app.route("/", methods=["GET"])
def index():
    return '', 200
# oven:route:start
# oven:route:start_pre
# oven:route:end_pre
# oven:route:name=subscribe_user
# oven:route:url=POST/user/<int:id>/subscribe
@app.route("/user/<int:id>/subscribe", methods=['POST'])
def subscribe_user(id):
# oven:route:start_code
    from flask import jsonify
    return jsonify({'bla': 'bla'})
# oven:route:end_code
# oven:route:end
if __name__ == '__main__':
    app.run('0.0.0.0', 80)