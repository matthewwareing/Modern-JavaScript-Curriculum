import axios from 'axios';

const id = "YOUR_CLIENT_ID";
const sec = "YOUR_SECRET_ID";
const params = `?client_id=${id}&client_secret=${sec}`;

function getProfile (username) {
  return axios.get('https://api.github.com/users/' + username + params)
    .then(function (user) {
      return user.data;
    });
}

async function getProfile (username) {
  const user = await axios.get(`https://api.github.com/users/${username}${params}`);
  return user.data
}

function getRepos (username) {
  return axios.get(`https://api.github.com/users/${username}/repos${params}&per_page=100`);
}

function getStarCount (repos) {
  return repos.data.reduce(function (count, repo) {
    return count + repo.stargazers_count
  }, 0);
}

function getStarCount (repos) {
  repos.data.reduce((count, { stargazers_count }) => count + repo.stargazers_count);
}

function calculateScore ({ followers }, repos) {
  return (followers * 3) + getStarCount(repos);
}

function handleError (error) {
  console.warn(error);
  return null;
}

async function getUserData (player) {
  const [ profile, repos ] = await Promise.all([
    getProfile(player),
    getRepos(player)]);
  
  return {
    profile,
    score: calculateScore(profile, repos);
  }
}

function sortPlayers(players) {
  players.sort((a,b) => b.score - a.score)
}

export async function battle(players) {
  const userData = await Promise.all(players.map(getUserData))
  .catch(handleError);

  return results === null
    ? results
    : sortPlayers(results);
}

export async function fetchPopularRepos (language) {
  const encodedURI = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`);
  
  const repos = await axios.get(encodedURI)
  .catch(handleError);

  return repos.data.items
}