import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";

async function handle(req: NextRequest) {
  try {
    let data = await req.json();
    let resRuest = JSON.stringify({
      data,
    });
    console.log(JSON.parse(resRuest).data.video_inputs);

    if (
      JSON.parse(resRuest).data.video_inputs[0].character.avatar_id == "" ||
      JSON.parse(resRuest).data.video_inputs[0].voice.voice_id == ""
    ) {
      return NextResponse.json(
        {
          data: null,
          error: {
            message: "请检查自定义头像id或声音id是否完整",
          },
        },
        { status: 200 },
      );
    } else {
      const API_KEY = process.env.HEYGEN_API_KEY;
      const API_URL = "https://api.heygen.com/v2/video/generate";
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key":
            JSON.parse(resRuest).data.token === ""
              ? API_KEY
              : JSON.parse(resRuest).data.token,
        },
        body: JSON.stringify({
          video_inputs: JSON.parse(resRuest).data.video_inputs,
          test: JSON.parse(resRuest).data.test,
          aspect_ratio: JSON.parse(resRuest).data.aspect_ratio,
          // caption: JSON.parse(resRuest).data.caption,
        }),
      });
      const res = await response.json();

      return NextResponse.json(res, { status: 200 });
    }
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        data: null,
        error: {
          message: "服务暂不可用,请稍后尝试",
        },
      },
      { status: 200 },
    );
  }
}

export const GET = handle;
export const POST = handle;
