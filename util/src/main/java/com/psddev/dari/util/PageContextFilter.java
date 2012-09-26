package com.psddev.dari.util;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Provides servlet page context information statically so that they can
 * be accessed from anywhere.
 */
public class PageContextFilter extends AbstractFilter {

    private static final ThreadLocal<HttpServletRequest> REQUEST = new ThreadLocal<HttpServletRequest>();
    private static final ThreadLocal<HttpServletResponse> RESPONSE = new ThreadLocal<HttpServletResponse>();
    private static final ThreadLocal<ServletContext> SERVLET_CONTEXT = new ThreadLocal<ServletContext>();

    private static final String ATTRIBUTE_PREFIX = PageContextFilter.class.getName() + ".";
    private static final String RESPONSE_ATTRIBUTE = ATTRIBUTE_PREFIX + "response";
    private static final String SERVLET_CONTEXT_ATTRIBUTE = ATTRIBUTE_PREFIX + "servletContext";

    /** @deprecated Use {@link Static#getRequest} instead. */
    @Deprecated
    public static HttpServletRequest getRequest() {
        return REQUEST.get();
    }

    /** @deprecated Use {@link Static#getResponse} instead. */
    @Deprecated
    public static HttpServletResponse getResponse() {
        return RESPONSE.get();
    }

    // --- AbstractFilter support ---

    @Override
    protected void doRequest(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain)
            throws IOException, ServletException {

        ServletContext context = getServletContext();

        try {
            REQUEST.set(request);
            RESPONSE.set(response);
            SERVLET_CONTEXT.set(context);

            request.setAttribute(RESPONSE_ATTRIBUTE, response);
            request.setAttribute(SERVLET_CONTEXT_ATTRIBUTE, context);

            chain.doFilter(request, response);

        } finally {
            REQUEST.remove();
            RESPONSE.remove();
            SERVLET_CONTEXT.remove();
        }
    }

    /**
     * {@link PageContextFilter} utility methods. All methods in this class
     * may throw an {@link IllegalStateException} if the
     * {@link PageContextFilter} isn't configured in the {@code web.xml}
     * deployment descriptor file.
     */
    public static final class Static {

        private Static() {
        }

        private static <T> T checkResult(T result) {
            if (result != null) {
                return result;
            } else {
                throw new IllegalStateException(String.format(
                        "[%s] not in web.xml filter chain!",
                        PageContextFilter.class));
            }
        }

        /** Returns the HTTP request associated with the current thread. */
        public static HttpServletRequest getRequest() {
            return checkResult(REQUEST.get());
        }

        /** Returns the HTTP response associated with the current thread. */
        public static HttpServletResponse getResponse() {
            return checkResult(RESPONSE.get());
        }

        /**
         * Returns the HTTP response associated with the given
         * {@code request}.
         */
        public static HttpServletResponse getResponse(HttpServletRequest request) {
            HttpServletResponse response = (HttpServletResponse) request.getAttribute(RESPONSE_ATTRIBUTE);
            return checkResult(response);
        }

        /** Returns the servlet context associated with the current thread. */
        public static ServletContext getServletContext() {
            return checkResult(SERVLET_CONTEXT.get());
        }

        /**
         * Returns the servlet context associated with the given
         * {@code request}.
         */
        public static ServletContext getServletContext(HttpServletRequest request) {
            ServletContext context = (ServletContext) request.getAttribute(SERVLET_CONTEXT_ATTRIBUTE);
            return checkResult(context);
        }
    }
}
