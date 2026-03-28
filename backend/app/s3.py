import boto3
import os
from dotenv import load_dotenv

load_dotenv()

s3_client = boto3.client(
    "s3",
    region_name=os.getenv("AWS_REGION"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
)

BUCKET_NAME = os.getenv("S3_BUCKET_NAME")


def generate_presigned_url(object_key: str, expiration: int = 3600) -> str:
    url = s3_client.generate_presigned_url(
        "put_object",
        Params={
            "Bucket": BUCKET_NAME,
            "Key": object_key,
            "ContentType": "video/mp4",
        },
        ExpiresIn=expiration,
    )
    return url


def get_video_url(object_key: str) -> str:
    return f"https://{BUCKET_NAME}.s3.amazonaws.com/{object_key}"