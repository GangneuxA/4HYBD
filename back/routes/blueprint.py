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
    get_job_by_user, 
    index_job, 
    create_job,
    delete_job,
    download_file
)
from controllers.storiesControllers import (
    get_job_by_user, 
    index_job, 
    create_job,
    delete_job,
    download_file
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
blueprint.route('/conversation', methods=['GET'])(get_job_by_user)
blueprint.route('/message', methods=['GET'])(index_job)
blueprint.route('/message', methods=['POST'])(create_job)
blueprint.route('/message', methods=['DELETE'])(delete)

#crud stories
blueprint.route('/stories', methods=['GET'])(get_job_by_user)
blueprint.route('/stories', methods=['POST'])(index_job)
blueprint.route('/stories', methods=['DELETE'])(delete)