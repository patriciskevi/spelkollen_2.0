const setActivePage = activePage => {
    state.currentPage = activePage;
    state.pages.map(page => {
        const thisPage = document.getElementById(page);
        if (page === state.currentPage) {
            thisPage.className = 'page page-active';
        } else {
            thisPage.className = 'page';
        }


    });
    if (activePage === 'page-login') {
        M.toast({
            html: 'Välj inlogg',
            displayLength: 6000
        });

    }
};

const state = {
    currentPage: 'page-login',
    pages: ['page-home', 'page-login']
};

/**
 * Get current user name from firebase auth email.
 */
const getCurrentUserName = ({
    email
}) => {
    // const email = firebase.auth().currentUser.email;

    if (email === "patriciskevi@gmail.com") {
        return "Patric";
    } else if (email === "taddis@gmail.com") {
        return "Tobias";
    } else if (email === "kent.carlsson@start-up.se") {
        return "Kent";
    }
}

export {
    setActivePage,
    state,
    getCurrentUserName
};
