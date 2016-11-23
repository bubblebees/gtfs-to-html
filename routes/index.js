const _ = require('lodash');
const gtfs = require('gtfs');
const router = require('express').Router();

const config = require('../config');
const utils = require('../lib/utils');


/*
 * Show all agencies
 */
router.get('/', (req, res, next) => {
  gtfs.agencies((err, agencies) => {
    if (err) return next(err);

    return res.render('agencies', { agencies: _.sortBy(agencies, 'agency_name') });
  });
});


/*
 * Show all timetable pages for an agency
 */
router.get('/timetablepages', (req, res, next) => {
  const agencyKey = req.query.agency_key;

  utils.getTimetablePages(agencyKey).then((timetablePages) => {
    const sortedTimetablePages = _.sortBy(timetablePages, 'route_label');
    res.render('timetablepages', { agencyKey, timetablePages: sortedTimetablePages });
  }, next);
});


/*
 * Show a specific timetable page
 */
router.get('/timetablepage', (req, res, next) => {
  const agencyKey = req.query.agency_key;
  const timetablePageId = req.query.timetable_page_id;

  utils.getTimetablePage(agencyKey, timetablePageId).then((timetablePage) => {
    utils.generateHTML(agencyKey, timetablePage, config, (err, html) => {
      if (err) return next(err);
      res.send(html);
    });
  }, next);
});

module.exports = router;
