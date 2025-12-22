/**
 * Projects API Service
 * Helper functions for creating FormData for Projects API
 */

/**
 * Helper function to create FormData from project object
 * @param {Object} project - Project data object
 * @param {Array} deletedMediaIds - Array of media IDs to delete (for updates)
 * @returns {FormData} FormData object ready for API
 */
export const createProjectFormData = (project, deletedMediaIds = []) => {
  const formData = new FormData();

  // Basic fields
  if (project.developer_id !== undefined) formData.append('developer_id', project.developer_id.toString());
  if (project.project_name) formData.append('project_name', project.project_name);
  if (project.project_type) formData.append('project_type', project.project_type);
  if (project.status) formData.append('status', project.status);
  if (project.expected_handover_date) formData.append('expected_handover_date', project.expected_handover_date);
  if (project.construction_progress !== undefined) formData.append('construction_progress', project.construction_progress.toString());
  if (project.project_description) formData.append('project_description', project.project_description);
  if (project.rera_municipality_number) formData.append('rera_municipality_number', project.rera_municipality_number);
  if (project.country) formData.append('country', project.country);
  if (project.city) formData.append('city', project.city);
  if (project.community) formData.append('community', project.community);
  if (project.sub_community) formData.append('sub_community', project.sub_community);
  if (project.dld_waiver) formData.append('dld_waiver', project.dld_waiver);
  if (project.post_handover_plan) formData.append('post_handover_plan', project.post_handover_plan);
  if (project.price_range_min !== undefined) formData.append('price_range_min', project.price_range_min.toString());
  if (project.price_range_max !== undefined) formData.append('price_range_max', project.price_range_max.toString());
  if (project.service_charge_per_sqft !== undefined) formData.append('service_charge_per_sqft', project.service_charge_per_sqft.toString());
  if (project.estimated_roi !== undefined) formData.append('estimated_roi', project.estimated_roi.toString());

  // JSON fields - send as JSON strings
  if (project.google_map_coordinates) {
    formData.append('google_map_coordinates', JSON.stringify(project.google_map_coordinates));
  }
  if (project.amenities && Array.isArray(project.amenities)) {
    formData.append('amenities', JSON.stringify(project.amenities));
  }
  if (project.payment_plans && Array.isArray(project.payment_plans)) {
    formData.append('payment_plans', JSON.stringify(project.payment_plans));
  }

  // Files
  // Masterplan (single file)
  if (project.masterplan && project.masterplan instanceof File) {
    formData.append('masterplan', project.masterplan);
  }

  // Floor plans (array of files)
  if (project.floor_plans && Array.isArray(project.floor_plans)) {
    project.floor_plans.forEach((plan) => {
      if (plan instanceof File) {
        formData.append('floor_plans[]', plan);
      }
    });
  }

  // Images (array of files)
  if (project.images && Array.isArray(project.images)) {
    project.images.forEach((image) => {
      if (image instanceof File) {
        formData.append('images[]', image);
      }
    });
  }

  // Videos (array of files)
  if (project.videos && Array.isArray(project.videos)) {
    project.videos.forEach((video) => {
      if (video instanceof File) {
        formData.append('videos[]', video);
      }
    });
  }

  // Deleted media IDs (for updates)
  if (deletedMediaIds && Array.isArray(deletedMediaIds)) {
    deletedMediaIds.forEach((id) => {
      formData.append('deleted_media_ids[]', id.toString());
    });
  }

  return formData;
};

