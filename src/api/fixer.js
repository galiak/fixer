import axios from 'axios';

const KEY = 'bd8dde68145388ef80ba9abda857e2cc';

export default axios.create({
  baseURL: 'http://data.fixer.io/api/',
  params: {
    access_key: KEY
  }
});
