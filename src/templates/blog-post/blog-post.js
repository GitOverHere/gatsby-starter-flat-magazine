import React from 'react';
import Layout from '../../components/layout/layout';
import { graphql, Link } from 'gatsby';
import Image from 'gatsby-image';
import BlockContent from '@sanity/block-content-to-react';
import urlBuilder from '@sanity/image-url';
import { BlogPostCols } from '../../components/common/style';
import AdsSidebar from '../../components/ads/ads-sidebar';
import { PostHeader, PostBody, AuthorDetails, PostImage } from './style';
import BlogPostImage from './blog-post-image';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export const query = graphql`
  query($slug: String!) {
    sanityPost(slug: { current: { eq: $slug } }) {
      title
      publishedAt(fromNow: true)
      mainImage {
        alt
        caption
        asset {
          fluid {
            ...GatsbySanityImageFluid
          }
        }
      }
      authors {
        author {
          name
          image {
            asset {
              fixed(toFormat: WEBP, width: 50, height: 50) {
                ...GatsbySanityImageFixed
              }
            }
          }
        }
      }
      categories {
        title
      }
      _rawBody(resolveReferences: { maxDepth: 10 })
    }
  }
`;
// const urlFor = (source) =>
//   urlBuilder({ projectId: 'rhqgrccr', dataset: 'production' }).image(source);

const serializers = {
  types: {
    // image: ({props}) => <img src={urlFor(props.node.asset).url()} alt="" />
    mainImage: ({ node }) => <BlogPostImage image={node} />,
    myCode: ({ node }) => {
      if (!node.code) return null;
      return (
        <SyntaxHighlighter
          language={node.language || 'text'}
          style={tomorrowNight}
          showLineNumbers
        >
          {node.code}
        </SyntaxHighlighter>
      );
    }
  },
  marks: {
    link: ({ children, mark }) => (
      <a
        href={mark.href}
        target={mark.blank && '_blank'}
        rel={mark.blank && 'noopener noreferrer'}
      >
        {children}
      </a>
    ),
    internalLink: ({ children, mark }) => (
      <Link to={`/blog/${mark.link}`}>{children}</Link>
    )
  }
};

function BlogPost({ data }) {
  const post = data.sanityPost;
  const title = post.title;
  const authorName = post.authors[0].author.name;
  const authorImage = post.authors[0].author.image.asset.fixed;
  const date = post.publishedAt;
  const postImg = post.mainImage.asset.fluid;
  const imgAlt = post.mainImage.alt;
  return (
    <Layout>
      <PostHeader>
        <h1>{title}</h1>
        <AuthorDetails>
          <Image fixed={authorImage} />
          <p>
            {authorName} <span>{date}</span>
          </p>
        </AuthorDetails>
        <PostImage>
          <Image fluid={postImg} alt={imgAlt} />
        </PostImage>
      </PostHeader>
      <BlogPostCols>
        <PostBody>
          <BlockContent
            blocks={data.sanityPost._rawBody}
            serializers={serializers}
          ></BlockContent>
        </PostBody>
        <AdsSidebar />
      </BlogPostCols>
    </Layout>
  );
}

export default BlogPost;
