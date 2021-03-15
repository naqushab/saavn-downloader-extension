const song_base = "https://snoidcdnems02.cdnsrv.jio.com/aac.saavncdn.com";
const image_base = "https://schnncdnems04.cdnsrv.jio.com/c.saavncdn.com";


async function handleRequest(request) {

    var pathname = new URL(request.url).pathname

    if (pathname.includes('/song/')) {
        var responsebuffer = await fetch(song_base + pathname.replace('/song', ''))
        var { headers } = responsebuffer
        var contenttype = headers.get("content-type")
        var buffer = await responsebuffer.arrayBuffer()
        return new Response(buffer, {
            status: 200,
            headers: ({
                "Content-Type": contenttype,
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Access-Control-Allow-Origin": "*"
            })
        })
    } else if (pathname.includes('/image/')) {
        var responsebuffer = await fetch(image_base + pathname.replace('/image', ''))
        var { headers } = responsebuffer
        var contenttype = headers.get("content-type")
        var buffer = await responsebuffer.arrayBuffer()
        return new Response(buffer, {
            status: 200,
            headers: ({
                "Content-Type": contenttype,
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Access-Control-Allow-Origin": "*"
            })
        })
    } else {
        return Response.redirect("https://github.com/naqushab/saavn-downloader-extension", 301)
    }
}
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})