const BREAKPOINTS = {
    mobile: 768
}

document.addEventListener('DOMContentLoaded', function () {
    mainSliderInit();
    parallaxInit();
    projectElementsInit();
    headerInit();
});

let timerBodyClass = null;
const toggleLockBody = (lock) => {
    const body = document.querySelector('body');
    const darkBody = document.querySelector('.dark-body')
    if (!darkBody || !body) {
        return;
    };

    let delay = 100;

    if (window.innerWidth <= BREAKPOINTS.mobile) {
        delay = 0;
    }

    const bodyLockRemove = () => {
        clearTimeout(timerBodyClass);
        if (!lock) {
            timerBodyClass = setTimeout(() => {
                body.style.paddingRight =  null;
                body.classList.remove('_lock');
                darkBody.classList.remove('_active');
            }, delay);
        }
    };
    const bodyLockAdd = () => {
        clearTimeout(timerBodyClass);
        if (lock) {
            timerBodyClass = setTimeout(() => {
                body.style.paddingRight = window.innerWidth - body.offsetWidth + 'px';
                body.classList.add('_lock');
                darkBody.classList.add('_active');
            }, delay);
        }
    };

    if (lock) {
        bodyLockAdd();
    } else {
        bodyLockRemove();
    }

    window.addEventListener('resize', function () {
        if (window.innerWidth <= BREAKPOINTS.mobile) {
            delay = 0;
        } else {
            delay = 100;
        }
    })
}

const mainSliderInit = function() {
    const CLASS = {
        main: 'sliders-main',
        slider: 'sliders-main__slider'
    }
    const slidersMain = document.querySelectorAll(`.${CLASS.main}`);
    slidersMain.forEach(sliderBlock => {
       const sliders = sliderBlock.querySelectorAll(`.${CLASS.slider}`);


       const optionsSlider = {
           direction: 'vertical',
           loop: true,
           speed: 1500,
           allowTouchMove: false,
           autoplay: {
               delay: 3000,
               disableOnInteraction: false,
               reverseDirection: true
           },
       }

       sliders.forEach(slide => {
           const swiper = new Swiper(slide, optionsSlider);
       })
    });
}

const parallaxInit = function () {
    const main = document.querySelector('main');
    const header = document.querySelector('.header');
    const parallaxTop = document.querySelector('.parallax-top');
    const parallaxBottom = document.querySelector('.parallax-bottom');

    if (!parallaxTop && !parallaxBottom) {
        return;
    }

    let windowWidth = window.outerWidth;
    const setParamsParallaxTop = (element, type = 'top') => {
        windowWidth = window.outerWidth;
        if (windowWidth >= BREAKPOINTS.mobile) {
            let headerHeight = header.offsetHeight;
            let elementHeight = element.offsetHeight;
            element.style.position = 'fixed';
            element.style.left = 0;
            if (type === 'top') {
                element.style.top = headerHeight + 'px';
                main.style.paddingTop = elementHeight + 'px';
                element.style.zIndex = 2;
            } else {
                element.style.bottom = 0;
                main.style.paddingBottom = elementHeight + 'px';
                element.style.zIndex = 1;
            }
        } else {
            element.style.position = null;
            element.style.left = null;
            element.style.zIndex = null;
            element.style.top = null;
            main.style.paddingTop = null;
        }
    }

    if (parallaxTop) {
        setParamsParallaxTop(parallaxTop);

        window.addEventListener('resize', function () {
            setParamsParallaxTop(parallaxTop);
        });
    }
    if (parallaxBottom) {
        setParamsParallaxTop(parallaxBottom, 'bottom');

        window.addEventListener('resize', function () {
            setParamsParallaxTop(parallaxBottom, 'bottom');
        });
    }

    window.addEventListener('scroll', function () {
        if (!parallaxTop && !parallaxBottom) {
            return;
        }
        if (windowWidth >= BREAKPOINTS.mobile) {
            const scrollY = window.scrollY;

            if (parallaxTop && scrollY > parallaxTop.offsetHeight) {
                parallaxTop.style.zIndex = 0;
            } else {
                parallaxTop.style.zIndex = 2;
            }
        }
    });
}

const projectElementsInit = function () {
    const projectsBlock = document.querySelector('.projects');
    if (projectsBlock) {
        const CLASS = {
            content: 'projects__content',
            start: 'projects__start-info',
            more: 'projects__more-info',
            slider: {
                block: 'img-slider',
                nextBtn: 'swiper-button-next',
                prevBtn: 'swiper-button-prev',
                pagination: 'swiper-pagination'
            },
            buttonBlock: 'projects__show-more-block',
            buttonShowMore: 'projects__show-more',
            _show: '_show',
        }
        const TEXT = {
            buttons: {
                show: 'Показать полностью',
                hide: 'Свернуть'
            }
        }

        const projects = projectsBlock.querySelectorAll('.projects__item');


        projects.forEach(item => {
            const content = item.querySelector(`.${CLASS.content}`);
            const moreBlock = item.querySelector(`.${CLASS.more}`);
            const buttonShowMore = item.querySelector(`.${CLASS.buttonShowMore}`);
            if (buttonShowMore){
                const textShow = buttonShowMore.dataset.show || TEXT.buttons.show;
                const textHide = buttonShowMore.dataset.hide || TEXT.buttons.hide;

                // SHOW MORE EVENTS
                const showMoreBlock = () => {
                    if (moreBlock) {
                        moreBlock.style.height = moreBlock.scrollHeight + 'px';
                        content.classList.add(CLASS._show);
                        buttonShowMore.textContent = textHide;
                    }
                }

                const hideMoreBlock = () => {
                    if (moreBlock) {
                        moreBlock.style.height = null;
                        content.classList.remove(CLASS._show);
                        buttonShowMore.textContent = textShow;
                    }
                }

                const toggleShowMore = () => {
                    if (!content.classList.contains(CLASS._show)) {
                        showMoreBlock();
                        return;
                    }

                    hideMoreBlock();
                }

                const initContentBlock = () => {
                    if (moreBlock && moreBlock.scrollHeight  === 0) {
                        moreBlock.style.display = 'none';
                        const buttonBlock = item.querySelector(`.${buttonBlock}`);
                        buttonBlock.style.display = 'none';
                    }
                    if (content.classList.contains(CLASS._show)) {
                        showMoreBlock();
                    }
                }

                buttonShowMore.addEventListener('click', toggleShowMore);

                window.addEventListener('resize', function () {
                    initContentBlock();
                })

                initContentBlock();
            }



        //    SWIPER EVENTS
            const sliders = item.querySelectorAll(`.${CLASS.slider.block}`);
            const sliderOptions = {
                slidesPerView: 2,
                loop: false,
            }

            sliders.forEach(slider => {
                const nextButton = slider.querySelector(`.${CLASS.slider.nextBtn}`);
                const prevButton = slider.querySelector(`.${CLASS.slider.prevBtn}`);
                const pagination = slider.querySelector(`.${CLASS.slider.pagination}`);

                const swiperOptions = Object.assign(sliderOptions, {
                    navigation: {
                        nextEl: nextButton,
                        prevEl: prevButton,
                    },
                    pagination: {
                        el: pagination,
                        type: 'bullets',
                        clickable: true,
                    }
                });

                const swiperImg = new Swiper(slider, swiperOptions);
            });
        });
    }
}

const headerInit = function () {
    const CLASS = {
        main: 'header',
        headerNewColor: 'new-color',
        logoBlock: 'header__logo-block',
        menu: 'header__menu',
        burger: 'js-menu-open',
        buttonCLose: 'js-menu-close',
        popup: 'menu__popup',
        tab: 'menu__tab',
        activeTab: '_active',
        tabsDecorationLine: 'menu__decoration-line',
        menuTabBlock: 'menu__tab-block',
        menuList: 'menu__list',
        _open: '_open',
        titleBLock: 'header__title-block',
        headerTitle: 'header__title',
        _first: '_first',
        _second: '_second',
        titleBlockItem: 'title',
        project: 'projects  ',
        projectItem: 'projects__item'
    }
    const header = document.querySelector(`.${CLASS.main}`);
    let headerHeight = header.offsetHeight;

    if (!header) {
        return;
    }

//     MENU EVENTS
    const buttonOpenMenu = header.querySelector(`.${CLASS.burger}`);
    const buttonCloseMenu =  header.querySelector(`.${CLASS.buttonCLose }`);
    const menu = header.querySelector(`.${CLASS.menu }`);

    const openMenu = () => {
        menu.classList.add(CLASS._open);
        header.classList.add(CLASS._open);
        toggleLockBody(true);
    }
    const closeMenu = () => {
        menu.classList.remove(CLASS._open);
        header.classList.remove(CLASS._open);
        toggleLockBody(false);
    }

    buttonOpenMenu.addEventListener('click', openMenu);
    buttonCloseMenu.addEventListener('click', closeMenu);
    document.addEventListener('click', function (e) {
        const target = e.target;
        const isMenu = target == menu || menu.contains(target);
        const isOpenMenu = menu.classList.contains(CLASS._open);

        if (!isMenu && isOpenMenu) {
            closeMenu();
        }
    });

//    TABS
    const tabs = header.querySelectorAll(`.${CLASS.tab }`)
    const line = header.querySelector(`.${CLASS.tabsDecorationLine}`);

    const currentTab = header.querySelector(`.${CLASS.tab }.${CLASS.activeTab}`);
    const currentIdBlock = currentTab.dataset.tab;

    const setLinePosition = (activeTab) => {
        if (!activeTab || !line) {
            return;
        }
        const widthTab = activeTab.offsetWidth;
        const positionTab = activeTab.offsetLeft;

        line.style.width = widthTab + 'px';
        line.style.left = positionTab + 'px';
    }

    const activatedBlock = (idBlock) => {
        const block = header.querySelector(`.${CLASS.menuTabBlock}[data-tab="${idBlock}"]`);
        if (!block) {
            return;
        }
        const activeBlocks = header.querySelectorAll(`.${CLASS.menuTabBlock}.${CLASS.activeTab}`);
        activeBlocks.forEach(activeBlock => {
            activeBlock.classList.remove(CLASS.activeTab);
        });
        block.classList.add(CLASS.activeTab);
    }

    setLinePosition(currentTab);
    activatedBlock(currentIdBlock);

    tabs.forEach(tab => {
        const idBlock = tab.dataset.tab;

        tab.addEventListener('click', function () {
            if (tab.classList.contains(CLASS.activeTab)) {
                return;
            }
            const activeTabs = header.querySelectorAll(`.${CLASS.tab }.${CLASS.activeTab}`);
            activeTabs.forEach(activeTab => {
                activeTab.classList.remove(CLASS.activeTab);
            });

            tab.classList.add(CLASS.activeTab)

            setLinePosition(tab);
            activatedBlock(idBlock);
        })
    });

//    MENU LINKS
    const menuItems = header.querySelectorAll(`.${CLASS.menuList} a`);

    const getHash = (link) => {
        const href = link.getAttribute('href');
        const hash = href.split('#')[1];
        return hash;
    }

    menuItems.forEach(link => {
        const hash = getHash(link);
        if (hash) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                if (link.classList.contains(CLASS.activeTab)) {
                   return;
                }
                const scrollBlock = document.querySelector(`#${hash}`);
                if (scrollBlock) {
                    const viewportOffset  = scrollBlock.getBoundingClientRect();
                    const topPosition = viewportOffset.top;
                    console.log(viewportOffset);
                    const height = window.scrollY + topPosition + 4;
                    closeMenu();
                    window.scrollTo({
                        top: height,
                        behavior: 'smooth'
                    })
                }
            });
        }
    });

//    EVENTS SCROLL
    const project = document.querySelector(`.${CLASS.project}`);
    const projectItems = project.querySelectorAll(`.${CLASS.projectItem}`);
    const headerTitleBLock = document.querySelector(`.${CLASS.titleBLock}`);
    projectItems.forEach(item => {
        const scrollBlockColor = item.style.getPropertyValue('--title-color');
        const scrollBlockBgColor = item.style.getPropertyValue('--bg-color');
        const title = item.querySelector(`.${CLASS.titleBlockItem}`);
        const newElement = document.createElement("p");
        newElement.classList.add(CLASS.headerTitle);
        newElement.textContent = title.textContent;
        newElement.dataset.color = scrollBlockColor;
        newElement.dataset.bgColor = scrollBlockBgColor;
        newElement.style.color = scrollBlockColor;
        newElement.dataset.id = item.getAttribute('id');
        headerTitleBLock.append(newElement);
    });

    const setHeaderActive = (idBlock) => {
        const title = headerTitleBLock.querySelector(`.${CLASS.headerTitle}[data-id="${idBlock}"]`);
        if(!title) {
            clearHeaderActive();
        }
        const topTitle = title.offsetTop;
        const colorTitle = title.dataset.color;
        const bgColorTitle = title.dataset.bgColor;

        header.style.setProperty('--header-color', colorTitle);
        header.style.setProperty('--header-bg', bgColorTitle);
        header.classList.add(CLASS.headerNewColor);
        headerTitleBLock.style.top = (-topTitle) + 'px';
    }
    const clearHeaderActive = (idBlock) => {
        header.style.removeProperty('--header-color');
        header.classList.remove(CLASS.headerNewColor);

        headerTitleBLock.style.top = null;
        const link =  document.querySelectorAll(`.${CLASS.menuList}`);
        link.forEach(el => {
            el.classList.remove(CLASS.activeTab);
        });
    }



    const activeBlockOnScroll = (block, windowScroll) => {
        const viewportOffset  = block.getBoundingClientRect();

        const topPosition = viewportOffset.top;
        const bottomPosition = viewportOffset.bottom;

        if (topPosition <= 0 &&  bottomPosition > 0) {
            console.log(block, 'this');
            const activeLinks = document.querySelectorAll(`.${CLASS.menuList} a.${CLASS.activeTab}`);
            activeLinks.forEach(el => {
                el.classList.remove(CLASS.activeTab);
            });
            const idBlock  = block.getAttribute('id');
            if (idBlock) {
                const link =  document.querySelector(`.${CLASS.menuList} a[href="#${idBlock}"]`);
                if (link) {
                    link.classList.add(CLASS.activeTab);
                }
                setHeaderActive(idBlock);
            }

        // .style.getPropertyValue('--main-bg-color');
        }

    }

    const projectsViewPort = () => {
        const windowScroll = window.scrollY;
        const projectsRect = project.getBoundingClientRect();
        const projectsTop = projectsRect.top;
        const projectsBottom = projectsRect.bottom;

        if (projectsTop <= 0 &&  projectsBottom > 0) {
            projectItems.forEach(block => {
                activeBlockOnScroll(block, windowScroll);
            });
        } else {
            clearHeaderActive();
        }
    }

    projectsViewPort();


    window.addEventListener('scroll', function () {
        projectsViewPort();
    });
}

// show more in menu ...
const showMoreInit = function () {
    const CLASS = {
        main: 'show-more',
        content: 'show-more__content',
        button: 'show-more__button',
        buttonBlock: 'show-more__button-block',
    }
}
