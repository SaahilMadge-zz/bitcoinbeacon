import os
import urllib
import jinja2
import webapp2

JINJA_ENVIRONMENT = jinja2.Environment(
	loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
	extensions = ['jinja2.ext.autoescape'],
	autoescape=True)

class MainPage(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('index.html')
        self.response.out.write(template.render())

class CreateNew(webapp2.RequestHandler):
	def get(self):
		template = JINJA_ENVIRONMENT.get_template('create_new.html')
		self.response.out.write(template.render())

class ProcessManifest(webapp2.RequestHandler):
	def get(self):
		template = JINJA_ENVIRONMENT.get_template('process_manifest.html')
		self.response.out.write(template.render())	

application = webapp2.WSGIApplication([
    ('/', MainPage), ('/createnew', CreateNew), ('/processmanifest', ProcessManifest)
], debug=True)