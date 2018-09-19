from time import sleep

from splinter.browser import Browser


from vortex.spider.pages import MediumPage


def browser():
    instance = Browser('firefox')
    instance.driver.maximize_window()
    instance.driver.implicitly_wait(3)
    return instance


def post_info(text):
    data = text.split()
    number_of_claps = data[0]
    number_of_clappers = data[3]
    return number_of_claps, number_of_clappers


page = MediumPage(browser(), url='https://medium.com/mawi-band/your-heart-is-a-new-biometrics-eda2c168f7b')
page.clappers_button().click()
sleep(1)
claps, clappers_number = post_info(page.claps_information().text)

while page.load_clappers_button().visible:
    page.load_clappers_button().click()
    print('Again')
    sleep(1)

for element in page.clappers():
    print(element.html.split('href=', 2)[-1].split()[0])
    print(element.text.split('\n')[:-1])

print('Finish')
