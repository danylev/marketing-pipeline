from vortex.spider.pages.elements import MEDIUM_PAGE_ELEMENTS
from vortex.config.settings import MEDIUM_UID, MEDIUM_SID


class MediumPage:

    base_url = 'https://medium.com'
    elements = MEDIUM_PAGE_ELEMENTS

    def __init__(self, browser, url=None):
        self.browser = browser
        self.browser.visit(self.base_url)
        self.browser.driver.add_cookie({'domain': 'medium.com', 'name': 'uid', 'value': MEDIUM_UID})
        self.browser.driver.add_cookie({'domain': 'medium.com', 'name': 'sid', 'value': MEDIUM_SID})
        if url:
            self.browser.visit(url)

    def clappers_button(self):
        return self.browser.find_by_xpath(self.elements.xpath.get('clappers_button')).first

    def claps_information(self):
        return self.browser.find_by_xpath(self.elements.xpath.get('claps_info')).first

    def load_clappers_button(self):
        return self.browser.find_by_xpath(self.elements.xpath.get('load_clappers_button')).first

    def clappers(self):
        return self.browser.find_by_xpath(self.elements.xpath.get('clappers'))
