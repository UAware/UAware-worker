const preFlightHeaders = [
  'Origin',
  'Access-Control-Request-Method',
  'Access-Control-Request-Headers',
]

const isPreFlight = ({ headers }) =>
  preFlightHeaders.every(
    preFlightHeader => headers.get(preFlightHeader) !== null,
  )

const handleOptions = request => {
  // Make sure the necessary headers are present
  // for this to be a valid pre-flight request
  if (isPreFlight(request)) {
    // Handle CORS pre-flight request.
    return new Response(null, {
      headers: {
        // CORS Headers
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
        'Access-Control-Max-Age': '86400',
        // Allow all future content Request headers to go back to browser
        // such as Authorization (Bearer) or X-Client-Name-Version
        'Access-Control-Allow-Headers': request.headers.get(
          'Access-Control-Request-Headers',
        ),
      },
    })
  }

  // Handle standard OPTIONS request.
  return new Response(null, {
    headers: {
      Allow: 'GET, HEAD, POST, OPTIONS',
    },
  })
}

// Russian and Belarussian locale codes
const targetCountries = ['RU', 'BY']

function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    return handleOptions(request)
  }

  // Identify requests by country. Coerce boolean to string ready to send in response
  const requestFromTargetCountries = `${targetCountries.includes(
    request.cf.country,
  )}`

  return new Response(requestFromTargetCountries, {
    headers: {
      'content-type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    },
  })
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
