const searchBarEl = document.getElementById("searchbar");
const searchBtnEl = document.getElementById("searchBtn");
const notFoundEl = document.getElementById("notFound");
const profileContainerEl = document.getElementById("profile_container");


const getGithubProfile = async (username) => {
    async function getData(username) {
        const url = `https://api.github.com/users/${username}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                notFoundEl.classList.remove("hide");
            } else {
                profileContainerEl.classList.remove("hide");
                const json = await response.json();
                // console.log(json);
                localStorage.setItem('profileData', JSON.stringify(json));
                return json;
            }

        } catch (error) {
            console.error(error.message);
        }
    }

    const profileData = await getData(username);
    return profileData;
};

const displayProfileCard = (githubProfile) => {
    console.log(githubProfile);

    if (!githubProfile) return;

    // Clear existing profile details before appending new ones
    const profileNameAndPfpEl = document.getElementById("profile_name_and_pfp");
    profileNameAndPfpEl.innerHTML = "";

    let img = document.createElement("img");
    img.id = "profilePic";
    img.className = "profilePic";
    img.src = githubProfile.avatar_url;
    img.style.width = "100px";
    img.style.borderRadius = "50%";
    profileNameAndPfpEl.appendChild(img);

    let profileNameDiv = document.createElement("div");
    profileNameDiv.id = "profileNameDiv";
    profileNameDiv.style.width = "100%";

    let profileNameEl = document.createElement("h1");
    profileNameEl.innerText = githubProfile.name;
    profileNameEl.style.fontSize = "18px";

    let loginNameEl = document.createElement("h1");
    loginNameEl.innerText = `@${githubProfile.login}`;
    loginNameEl.style.fontSize = "16px";
    loginNameEl.style.fontWeight = "300";


    profileNameDiv.append(profileNameEl, loginNameEl);
    profileNameAndPfpEl.appendChild(profileNameDiv);

    profileNameAndPfpEl.style.display = "flex";
    profileNameAndPfpEl.style.gap = "20px";
    profileNameAndPfpEl.style.alignItems = "center";

    // check profile button

    let checkProfileBtn = document.createElement("button");
    checkProfileBtn.innerText = "Check Profile";
    checkProfileBtn.style.width = "200px";
    checkProfileBtn.style.height = "30px";
    checkProfileBtn.style.backgroundColor = "#a401a4";
    checkProfileBtn.style.color = "white";
    checkProfileBtn.style.border = "none";
    checkProfileBtn.style.borderRadius = "5px";


    checkProfileBtn.addEventListener('mouseover', () => {
        checkProfileBtn.style.backgroundColor = "#800080";
    });

    checkProfileBtn.addEventListener('mouseout', () => {
        checkProfileBtn.style.backgroundColor = "#a401a4";
    });

    checkProfileBtn.addEventListener('click', (event) => {
        event.preventDefault();
        window.open(githubProfile.html_url, '_blank');
        return false;
    });


    profileNameAndPfpEl.appendChild(checkProfileBtn);
    profileNameAndPfpEl.style.padding = "75px 30px";

    //about github profile

    let profileAboutBioEl = document.getElementById("profile_about_bio");

    if (githubProfile.bio !== null) {
        profileAboutBioEl.innerText = githubProfile.bio;
    } else {
        profileAboutBioEl.innerText = "No Bio Provided.";
    }

    //github profile details

    let followersEl = document.getElementById("followers");
    let followingsEl = document.getElementById("followings");
    let reposEl = document.getElementById("repos");

    followersEl.innerText = githubProfile.followers;
    followingsEl.innerText = githubProfile.following;
    reposEl.innerText = githubProfile.public_repos;

};

window.addEventListener("DOMContentLoaded", async () => {
    const profileDataObj = localStorage.getItem("profileData");


    if (profileDataObj) {
        const profileData = JSON.parse(profileDataObj);
        console.log(profileData);
        profileContainerEl.classList.remove("hide");
        displayProfileCard(profileData);
    }
});


searchBtnEl.addEventListener("click", async () => {
    notFoundEl.classList.add("hide");
    if (searchBarEl.value) {

        const username = searchBarEl.value;
        const githubProfile = await getGithubProfile(username);
        displayProfileCard(githubProfile);
    } else {
        notFoundEl.classList.remove("hide");
    }
});

