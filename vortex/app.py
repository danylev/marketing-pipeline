import sys
import os.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir)))

from falcon import API  # noqa
from vortex.api import MediumPosts  # noqa
"""
API, include middleware here
"""
application = API()
"""
API routes
"""
application.add_route('/medium', MediumPosts())
