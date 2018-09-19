from vortex.utils.data_containers import PageDict


# List of pages and their vital elements


MEDIUM_PAGE_ELEMENTS = PageDict(
    xpath={
        'clappers_button': '/html/body/div[1]/div[2]/div/div[4]/div/div/div/div/div[2]/div/div/span/button',
        'claps_info': '/html/body/div[4]/div/h3',
        'clappers': '/html/body/div[4]/div/div/ul/li',
        'clapper': {
            'name': '/div[2]/a',
            'description': '/div[2]/p'
        },
        'load_clappers_button': '/html/body/div[4]/div/div/button',
    },
    css={
        'promotion_block': "js-stickyFooter",
    },
    name={

    }
)
