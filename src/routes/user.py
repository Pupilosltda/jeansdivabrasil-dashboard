from flask import Blueprint, request, jsonify

user_bp = Blueprint("user", __name__)

@user_bp.route("/users", methods=["GET"])
def get_users():
    return jsonify({"message": "User data will be here"})


