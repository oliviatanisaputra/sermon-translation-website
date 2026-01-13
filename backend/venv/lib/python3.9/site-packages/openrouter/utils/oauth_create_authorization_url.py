"""Generate OAuth2 authorization URL"""

from dataclasses import dataclass
from typing import TYPE_CHECKING, Literal, Optional, Union
from urllib.parse import ParseResult, urlencode

if TYPE_CHECKING:
    from openrouter.sdk import OpenRouter


@dataclass
class CreateAuthorizationUrlRequestBase:
    """Base request parameters for creating an authorization URL"""
    callback_url: Union[str, ParseResult]
    limit: Optional[float] = None


@dataclass
class CreateAuthorizationUrlRequestWithPKCE:
    """Request parameters with PKCE for creating an authorization URL"""
    callback_url: Union[str, ParseResult]
    code_challenge_method: Literal["S256", "plain"]
    code_challenge: str
    limit: Optional[float] = None


# Union type for request - either with PKCE or without
CreateAuthorizationUrlRequest = Union[
    CreateAuthorizationUrlRequestWithPKCE,
    CreateAuthorizationUrlRequestBase,
]


def _get_server_url(client: "OpenRouter") -> str:
    """
    Get the server URL from the client configuration

    Args:
        client: OpenRouter client instance

    Returns:
        The server URL

    Raises:
        ValueError: If no server URL is configured
    """
    server_url, _ = client.sdk_configuration.get_server_details()
    if not server_url:
        raise ValueError("No server URL configured")
    return server_url


def oauth_create_authorization_url(
    client: "OpenRouter",
    params: CreateAuthorizationUrlRequest,
) -> str:
    """
    Generate an OAuth2 authorization URL

    Generates a URL to redirect users to for authorizing your application. The
    URL includes the provided callback URL and, if applicable, the code
    challenge parameters for PKCE.

    Args:
        client: OpenRouter client instance
        params: Request parameters including callback URL and optional PKCE parameters

    Returns:
        The authorization URL as a string

    Raises:
        ValueError: If no server URL is configured or parameters are invalid

    See Also:
        - https://openrouter.ai/docs/use-cases/oauth-pkce
    """
    base_url = _get_server_url(client)

    # Build the auth URL
    auth_url = f"{base_url}/auth"

    # Build query parameters
    query_params = {
        "callback_url": str(params.callback_url),
    }

    # Add PKCE parameters if present
    if isinstance(params, CreateAuthorizationUrlRequestWithPKCE):
        query_params["code_challenge"] = params.code_challenge
        query_params["code_challenge_method"] = params.code_challenge_method

    # Add limit if present
    if params.limit is not None:
        query_params["limit"] = str(params.limit)

    # Construct final URL with query parameters
    return f"{auth_url}?{urlencode(query_params)}"
