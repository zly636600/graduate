import axios from 'axios';

export default class DataProvider{
    static getbaseCsv(){
        //return axios.get('https://raw.githubusercontent.com/zly636600/graduate/master/src/data/baseStation.csv')
        return axios.get('./static/baseStation.csv')
    }

    static getMapJson() {

        //console.log(data)

        //return axios.get('https://raw.githubusercontent.com/zly636600/graduate/master/src/data/china.json')
        return axios.get('./static/china.json')
    }

    static getMianYangJson(){
        //return axios.get('https://raw.githubusercontent.com/zly636600/graduate/master/src/data/mianyang.json')
        return axios.get('./static/mianyang.json')
    }

}