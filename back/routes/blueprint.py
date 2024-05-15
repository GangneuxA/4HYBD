from flask import Blueprint
from controllers.usersControllers import (
    index, 
    create, 
    insert,
    update,
    delete, 
    login,
    logout,
    get_me,
)

from controllers.messagesControllers import (
    send_message, 
    get_messages, 
    get_conversations,
    del_message,
)
from controllers.storiesControllers import (
    create_story, 
    get_stories, 
    del_stories
)


blueprint = Blueprint('blueprint', __name__)

blueprint.route('/', methods=['GET'])(create)

#crud user
blueprint.route('/getme', methods=['GET'])(get_me)
blueprint.route('/users', methods=['GET'])(index) #require admin
blueprint.route('/users', methods=['POST'])(insert)
blueprint.route('/users', methods=['PUT'])(update)
blueprint.route('/users', methods=['DELETE'])(delete)

#connection management
blueprint.route('/login', methods=['POST'])(login)
blueprint.route('/logout', methods=['POST'])(logout)

#crud message
blueprint.route('/conversation', methods=['GET'])(get_conversations)
blueprint.route('/message/<int:id>', methods=['GET'])(get_messages)
blueprint.route('/message', methods=['POST'])(send_message)
blueprint.route('/message/<int:id>', methods=['DELETE'])(del_message)

#crud stories
blueprint.route('/stories', methods=['GET'])(get_stories)
blueprint.route('/stories', methods=['POST'])(create_story)
blueprint.route('/stories/<int:id>', methods=['DELETE'])(del_stories)