import axios from 'axios';

export default class DataProvider{
    static getpigjiangCsv(){
        return axios.get('https://raw.githubusercontent.com/zly636600/graduate/master/src/data/pigjiang.csv')
    }

    static getMapJson() {

        //console.log(data)

        return axios.get('https://raw.githubusercontent.com/zly636600/graduate/master/src/data/china.json')
    }
}