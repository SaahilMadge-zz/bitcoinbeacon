import jinja2
import os
import webapp2
import urllib
import json
import logging
import uuid
import random
import string

from google.appengine.ext import ndb

JINJA_ENVIRONMENT = jinja2.Environment(
	loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
	extensions = ['jinja2.ext.autoescape'],
	autoescape=True)

class Manifest(ndb.Model):
	# num_participants = ndb.IntegerProperty()
	# num_winners = ndb.IntegerProperty()
	# future_block = ndb.IntegerProperty()
	# random_key = ndb.
	manifest_details = ndb.JsonProperty()
	# optional_script = ndb.TextProperty(default = None)

class MainPage(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('index.html')
        self.response.write(template.render())

class CreateNew(webapp2.RequestHandler):
	def get(self):
		template = JINJA_ENVIRONMENT.get_template('create_new.html')
		self.response.write(template.render())

class SaveManifest(webapp2.RequestHandler):
	def post(self):
		manifestContent = json.loads(self.request.body)
		logging.info(manifestContent)

		def generateManifestID():
			return ''.join(random.choice('abcdefghjkmnpqrtuvwxyz2346789') for _ in range(5))

		manifest_id = generateManifestID()
		while(Manifest.get_by_id(manifest_id)):
			manifest_id = generateManifestID()

		logging.info(manifest_id)

		manifest = Manifest(id = manifest_id, manifest_details = manifestContent)
		manifest.put()

		self.response.write(manifest_id)
		# template = JINJA_ENVIRONMENT.get_template('display_submitted_manifest.html')
		# template_values = {'manifest': manifest}
		# self.response.write(template.render(template_values))

class DisplayManifest(webapp2.RequestHandler):
	def get(self):
		# logging.info(self.request.path)
		# logging.info(self.request.path.split("/")[-1])
		manifest_id = self.request.path.split("/")[-1]
		manifest = Manifest.get_by_id(manifest_id)
		logging.info(manifest)
		template_values = {'manifest' : manifest.manifest_details, 'id' : manifest_id}
		template = JINJA_ENVIRONMENT.get_template('display_manifest.html')
		self.response.write(template.render(template_values))

class ProcessManifest(webapp2.RequestHandler):
	def get(self):
		template = JINJA_ENVIRONMENT.get_template('process_manifest.html')
		self.response.out.write(template.render())	

application = webapp2.WSGIApplication([
    ('/', MainPage), ('/createnew', CreateNew), ('/processmanifest', ProcessManifest), ('/created', SaveManifest), ('/manifest/\w*', DisplayManifest)
], debug=True)