var mongoose = require('mongoose')
var router = require('express').Router()
var passport = require('passport')
var User = mongoose.model('User')
var auth = require('../auth')

router.get('/user', auth.required, function (req, res, next) {
    User.findById(req.payload.id)
        .then(function (user) {
            if (!user) {
                return res.sendStatus(401)
            }

            return res.json({ user: user.toAuthJSON() })
        })
        .catch(next)
})
router.put('/user', auth.required, function (req, res, next) {
    User.findById(req.payload.id)
        .then(function (user) {
            if (!user) {
                return res.sendStatus(401)
            }

            // only update fields that were actually passed...
            if (typeof req.body.user.username !== 'undefined') {
                user.username = req.body.user.username
            }
            if (typeof req.body.user.fullname !== 'undefined') {
                user.fullname = req.body.user.fullname
            }
            if (typeof req.body.user.email !== 'undefined') {
                user.email = req.body.user.email
            }
            if (typeof req.body.user.bio !== 'undefined') {
                user.bio = req.body.user.bio
            }
            if (typeof req.body.user.image !== 'undefined') {
                user.image = req.body.user.image
            }
            if (typeof req.body.user.password !== 'undefined') {
                user.setPassword(req.body.user.password)
            }

            return user.save().then(function () {
                return res.json({ user: user.toAuthJSON() })
            })
        })
        .catch(next)
})

router.post('/user/login', function (req, res, next) {
    if (!req.body.user.email) {
        return res.status(422).json({ errors: { email: "can't be blank" } })
    }

    if (!req.body.user.password) {
        return res.status(422).json({ errors: { password: "can't be blank" } })
    }

    passport.authenticate('local', { session: false }, function (
        err,
        user,
        info
    ) {
        if (err) {
            return next(err)
        }

        if (user) {
            user.token = user.generateJWT()
            return res.json({ user: user.toAuthJSON() })
        } else {
            return res.status(422).json(info)
        }
    })(req, res, next)
})

router.post('/user', function (req, res, next) {
    var user = new User()

    user.username = req.body.user.username
    user.email = req.body.user.email
    user.fullname = req.body.user.fullname
    user.setPassword(req.body.user.password)

    user
        .save()
        .then(function () {
            return res.json({ user: user.toAuthJSON() })
        })
        .catch(next)
})

router.get("/user/videos", function (req, res, next) {
    console.log('here');
    const videos = [{
        status: "active",
        noOfViews: 1779,
        noOfQueue: 0,
        noOfConversation: 1,
        link: "",
        description: "#test #automation #first #time #upload",
        duration: "13",
        size: "5",
        aspect_ratio: "",
        resolution: "1280x720",
        videoUrl: "http://media.begenuin.com/temp_video/919409215070_1599480310663.mp4",
        videoThumbnail: "http://api.qa.begenuin.com/thumbnail/919409215070_1599480310663.png",
        videoPreviewImage: "http://api.qa.begenuin.com/video_preview_images/919409215070_1599480310663.png",
        videoPreview1200: "http://api.qa.begenuin.com/video_preview_1200/919409215070_1599480310663.png",
        videoPreviewName: "919409215070_1599480310663.png",
        videoShareImage: "http://api.qa.begenuin.com/video_share_images/snapshot_919409215070_1599480310663.png"
    },
    {
        status: "active",
        noOfViews: 188,
        noOfQueue: 3,
        noOfConversation: 1,
        link: "",
        description: "#blockfunctionality",
        duration: "9",
        size: "5",
        aspect_ratio: "",
        resolution: "1280x720",
        videoUrl: "http://media.begenuin.com/temp_video/919638549990_1597043219510.mp4",
        videoThumbnail: "http://api.qa.begenuin.com/thumbnail/919638549990_1597043219510.png",
        videoPreviewImage: "http://api.qa.begenuin.com/video_preview_images/919638549990_1597043219510.png",
        videoPreview1200: "http://api.qa.begenuin.com/video_preview_1200/919638549990_1597043219510.png",
        videoPreviewName: "919638549990_1597043219510.png",
        videoShareImage: "https://dummyimage.com/350x650/000/fff"
    }, {
        status: "active",
        noOfViews: 428,
        noOfQueue: 1,
        noOfConversation: 1,
        link: "begenuin.com",
        description: "#transition donald #Trump ",
        duration: "15",
        size: "1",
        aspect_ratio: "",
        resolution: "1080p",
        videoUrl: "http://media.begenuin.com/temp_video/15167175011_1597930499270.mp4",
        videoThumbnail: "http://api.qa.begenuin.com/thumbnail/15167175011_1597930499270.jpeg",
        videoPreviewImage: "http://api.qa.begenuin.com/video_preview_images/15167175011_1597930499270.jpeg",
        videoPreview1200: "http://api.qa.begenuin.com/video_preview_1200/15167175011_1597930499270.jpeg",
        videoPreviewName: "15167175011_1597930499270.jpeg",
        videoShareImage: "https://dummyimage.com/350x650/000/fff"
    }
    ];
    return res.json({ videos })
})

module.exports = router
