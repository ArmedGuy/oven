export default {
  debug: false,
  testing: false,
  api_type: 'web',
  api_path: "http://" + location.hostname + '/api/',
  cas_service_url: 'http://' + location.hostname + '/api/account/session/authenticate'
};
