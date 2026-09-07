"""Generate SHA-256 code challenge for PKCE OAuth flow"""

import base64
import hashlib
import re
import secrets
from dataclasses import dataclass
from typing import Optional


@dataclass
class CreateSHA256CodeChallengeRequest:
    """
    Request parameters for creating a SHA-256 code challenge.

    If not provided, a random code verifier will be generated.
    If provided, must be 43-128 characters and contain only unreserved
    characters [A-Za-z0-9-._~] per RFC 7636.
    """
    code_verifier: Optional[str] = None


@dataclass
class CreateSHA256CodeChallengeResponse:
    """Response containing the code challenge and verifier"""
    code_challenge: str
    code_verifier: str


def _array_buffer_to_base64_url(data: bytes) -> str:
    """
    Convert bytes to base64url encoding (RFC 4648)

    Args:
        data: Bytes to encode

    Returns:
        Base64url encoded string
    """
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _generate_code_verifier() -> str:
    """
    Generate a cryptographically random code verifier per RFC 7636

    RFC 7636 recommends 32 octets of random data, base64url encoded = 43 chars

    Returns:
        A random code verifier string
    """
    random_bytes = secrets.token_bytes(32)
    return _array_buffer_to_base64_url(random_bytes)


def _validate_code_verifier(code_verifier: str) -> None:
    """
    Validate code verifier according to RFC 7636

    Args:
        code_verifier: The code verifier to validate

    Raises:
        ValueError: If the code verifier is invalid
    """
    if len(code_verifier) < 43:
        raise ValueError("Code verifier must be at least 43 characters")
    if len(code_verifier) > 128:
        raise ValueError("Code verifier must be at most 128 characters")
    if not re.match(r"^[A-Za-z0-9\-._~]+$", code_verifier):
        raise ValueError(
            "Code verifier must only contain unreserved characters: [A-Za-z0-9-._~]"
        )


def oauth_create_sha256_code_challenge(
    params: Optional[CreateSHA256CodeChallengeRequest] = None,
) -> CreateSHA256CodeChallengeResponse:
    """
    Generate a SHA-256 code challenge for PKCE

    Generates a SHA-256 code challenge and corresponding code verifier for use
    in the PKCE extension to OAuth2. If no code verifier is provided, a random
    one will be generated according to RFC 7636 (32 random bytes, base64url
    encoded). If a code verifier is provided, it must be 43-128 characters and
    contain only unreserved characters [A-Za-z0-9-._~].

    Args:
        params: Optional request parameters. If None, a random code verifier will be generated.

    Returns:
        CreateSHA256CodeChallengeResponse containing the code challenge and verifier

    Raises:
        ValueError: If the provided code verifier is invalid

    See Also:
        - https://openrouter.ai/docs/use-cases/oauth-pkce
        - https://datatracker.ietf.org/doc/html/rfc7636
    """
    if params is None:
        params = CreateSHA256CodeChallengeRequest()

    code_verifier = params.code_verifier
    if code_verifier is None:
        code_verifier = _generate_code_verifier()
    else:
        _validate_code_verifier(code_verifier)

    # Generate SHA-256 hash
    data = code_verifier.encode("utf-8")
    hash_digest = hashlib.sha256(data).digest()

    # Convert hash to base64url
    code_challenge = _array_buffer_to_base64_url(hash_digest)

    return CreateSHA256CodeChallengeResponse(
        code_challenge=code_challenge,
        code_verifier=code_verifier,
    )
