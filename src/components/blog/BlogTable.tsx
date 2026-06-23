"use client";

import React from "react";
import { BlogPost } from "@/types/blog";
import styles from "./BlogTable.module.css";
import Image from "next/image";
import { resolveImageUrl } from "@/utils/imagePath";

interface BlogTableProps {
  blogs: BlogPost[];
  onEdit: (blog: BlogPost) => void;
  onDelete: (blogId: string) => void;
  loading?: boolean;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const BlogTable: React.FC<BlogTableProps> = ({
  blogs,
  onEdit,
  onDelete,
  loading = false,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleDelete = (blogId: string) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      onDelete(blogId);
    }
  };

  const getVisibilityBadge = (visibility: string) => {
    if (visibility === "PUBLISHED") {
      return <span className={styles.badgePublished}>PUBLISHED</span>;
    }
    return <span className={styles.badgeDraft}>DRAFT</span>;
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th>Title</th>
            <th>Author</th>
            <th>Visibility</th>
            <th>Published Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className={styles.loadingCell}>
                Loading...
              </td>
            </tr>
          ) : blogs.length === 0 ? (
            <tr>
              <td colSpan={6} className={styles.emptyCell}>
                No blogs found
              </td>
            </tr>
          ) : (
            blogs.map((blog) => (
              <tr key={blog.post_id || blog.id}>
                <td className={styles.thumbnailCell}>
                  {blog.thumbnail_url ? (
                    <Image
                      src={resolveImageUrl(blog.thumbnail_url)}
                      alt={blog.post_title}
                      className={styles.thumbnail}
                    />
                  ) : (
                    <div className={styles.placeholderImage}>📷</div>
                  )}
                </td>
                <td>
                  <div className={styles.titleCell}>
                    <strong>{blog.post_title}</strong>
                  </div>
                </td>
                <td>{blog.owner_details?.author_name || "Unknown"}</td>
                <td>{getVisibilityBadge(blog.post_visibility)}</td>
                <td>{formatDate(blog.published_at)}</td>
                <td className={styles.actionsCell}>
                  <button
                    className={styles.actionButton}
                    onClick={() => onEdit(blog)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(blog.post_id || blog.id || "")}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <span>
            Page {currentPage} of {totalPages} ({totalCount} total)
          </span>
          <div className={styles.paginationButtons}>
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(1)}
              className={styles.paginationButton}
            >
              {"<<"}
            </button>
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className={styles.paginationButton}
            >
              {"<"}
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className={styles.paginationButton}
            >
              {">"}
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(totalPages)}
              className={styles.paginationButton}
            >
              {">>"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogTable;
