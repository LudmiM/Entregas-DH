const path = require('path');
const db = require('../../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');
const { throws } = require('assert');


//Aqui tienen otra forma de llamar a cada uno de los modelos
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;

const modelMovie = {
    attributes: {
        exclude: ['genre_id','created_at','updated_at','release_date']
    },
    include: [{
        association: 'genre',
        attributes: ['name','ranking']
    }]
}

const moviesController = {
    'list': async (req, res) => {
        try {
            const movies = await db.Movie.findAll(modelMovie)
            const moviesWithURL = movies.map(m => {
                return {
                    ...m.dataValues,
                    URL: `${req.protocol}://${req.get('host')}/api/movies/${m.id}`
                }
            })
            return res.status(200).json({
                ok: true,
                meta: {
                    status: 200,
                    total: movies.length,
                    url: `${req.protocol}://${req.get('host')}/api/movies` //Endpoind
                },
                data: moviesWithURL
            })
        } catch (error) {
            return res.status(error.status || 500).json({
                ok:false,
                msg:error.message || 'Ups, hubo un error. LLama a EriC'
            })
        }
    },
    'detail': async (req, res) => {
        try {
            let error
            if (isNaN(req.params.id)) {
                error = new Error('ID invalido')
                error.status=400
                throw error
            }
            const movie = await db.Movie.findByPk(req.params.id,modelMovie)
            if (!movie) {
                error = new Error('No se encontro la peli')
                error.status=404
                throw error
            }
        
            return res.status(200).json({
                ok: true,
                meta: {
                    status: 200,
                    url: `${req.protocol}://${req.get('host')}/api/movies/${movie.id}` //Endpoind
                },
                data: movie
            })
        } catch (error) {
            return res.status(error.status || 500).json({
                ok:false,
                msg:error.message || 'Ups, hubo un error. LLama a EriC'
            })
        }
    },
    'newest': async (req, res) => {
        try {
            const movies = await db.Movie.findAll({
                order : [
                    ['release_date', 'DESC']
                ],
                limit: 5,
                ...modelMovie
            })
            return res.status(200).json({
                ok: true,
                meta: {
                    status: 200,
                    url: `${req.protocol}://${req.get('host')}/api/movies/new` //Endpoind
                },
                data: movies
            })
        } catch (error) {
            return res.status(error.status || 500).json({
                ok:false,
                msg:error.message || 'Ups, hubo un error. LLama a EriC'
            })
        }
    },
    'recomended': async (req, res) => {
        try {
            const movies = await db.Movie.findAll({
                where: {
                    rating: {[db.Sequelize.Op.gte] : 8}
                },
                order: [
                    ['rating', 'DESC']
                ],
                ...modelMovie
            })
            return res.status(200).json({
                ok: true,
                meta: {
                    status: 200,
                    url: `${req.protocol}://${req.get('host')}/api/movies/recommended` //Endpoind
                },
                data: movies
            })
        } catch (error) {
            return res.status(error.status || 500).json({
                ok:false,
                msg:error.message || 'Ups, hubo un error. LLama a EriC'
            })
        }
    },
    //Aqui es otroo
    create: async function (req,res) {
        const { title,rating,awards,release_date,length,genre_id } = req.body

        try {
            if ([title,rating,awards,release_date,length,genre_id].includes("" || undefined)) {
                throw new Error('Los campos no deen estar vacios')
            }
            const newMovie = await Movies.create(
                {
                    title,
                    rating,
                    awards,
                    release_date,
                    length,
                    genre_id
                }
            )
            const movie = await db.Movie.findByPk(newMovie.id,modelMovie)
            return res.status(200).json({
                ok: true,
                meta: {
                    status: 200,
                    url: `${req.protocol}://${req.get('host')}/api/movies/${movie}` //Endpoind
                },
                data:movie
            })
            
        } catch (error) {
            return res.status(error.status || 500).json({
                ok:false,
                msg:error.message || 'Ups, hubo un error. LLama a EriC'
            })
        }
    },
    update: async function (req,res) {
        try {
            let movieId = +req.params.id;
            const movies = await Movies.update({
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            },{
                where: {id: movieId}
            })
            return res.status(200).json({
                ok: true,
                meta: {
                    status: 200,
                    url: `${req.protocol}://${req.get('host')}/api/movies/update` //Endpoind
                },
                data: movies
            })
        } catch (error) {
            return res.status(error.status || 500).json({
                ok:false,
                msg:error.message || 'Ups, hubo un error. LLama a EriC'
            })
        }
    },
    destroy: async function (req,res) {
        try {
            let movieId = req.params.id;
            const movie = await Movies.destroy({where: {id: movieId}, force: true}) // force: true es para asegurar que se ejecute la acción
            return res.status(200).json({
                ok: true,
                meta: {
                    status: 200,
                    url: `${req.protocol}://${req.get('host')}/api/movies/${movie.id}` //Endpoind
                },
                data: movie
            })
        } catch (error) {
            return res.status(error.status || 500).json({
                ok:false,
                msg:error.message || 'Ups, hubo un error. LLama a EriC'
            })
        } 
    }
}

module.exports = moviesController;