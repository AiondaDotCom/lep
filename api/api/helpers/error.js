module.exports.sendMsg = function(res, err) {
  console.log(err);
  if (err && err.code && err.message) {
    res.status(err.code);
    res.json({
      'message': err.message
    });
  } else {
    res.status(500);
    res.json({
      'message': 'Internal Server Error'
    });
  }
}
