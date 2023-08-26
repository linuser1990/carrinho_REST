
const redirecionaHome = async (req, res) => {
   res.render('./home/index',{ user: req.session.username })
}

module.exports = {
  redirecionaHome
}
