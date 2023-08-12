
const redirecionaHome = async (req, res) => {
   res.render('./home/index',{ user: req.user.username })
}

module.exports = {
  redirecionaHome
}
