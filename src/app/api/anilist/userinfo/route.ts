const userInfoQuery = `query {
            Viewer {
              id
              name
              avatar {
                  large
                  medium
              }
              bannerImage
            }
          }`;

interface UserQuery {
  data: { Viewer: { id: string; name: string; avatar: { large: string; medium: string; }; bannerImage: string; }; };
}


export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const authorization = req.headers.get("Authorization");
    if (!authorization)
      return Response.json("Token is required!", { status: 401 });
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: userInfoQuery,
      }),
    });
    const data: UserQuery = await res.json() as unknown as UserQuery;
    const { id, name, avatar } = data.data.Viewer;

    return Response.json(
      {
        id: `${id}`,
        username: name,
        image_url: avatar.large,
        email: `${name}test@gmail.com`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}