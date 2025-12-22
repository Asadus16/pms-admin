/**
 * Property Manager - Projects Redux Slice
 * Manages projects state for property manager
 */

import { createSlice } from '@reduxjs/toolkit';
import {
  fetchPropertyManagerProjects,
  fetchPropertyManagerProjectById,
  createPropertyManagerProject,
  updatePropertyManagerProject,
  deletePropertyManagerProject,
} from '../../../thunks/property-manager/propertyManagerThunks';

const initialState = {
  items: [],
  currentItem: null,
  pagination: {
    current_page: 1,
    per_page: 15,
    last_page: 1,
    total: 0,
  },
  loading: false,
  error: null,
};

const projectsSlice = createSlice({
  name: 'propertyManager/projects',
  initialState,
  reducers: {
    clearProject: (state) => {
      state.currentItem = null;
      state.error = null;
    },
    clearProjects: (state) => {
      state.items = [];
      state.pagination = initialState.pagination;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch projects list
    builder
      .addCase(fetchPropertyManagerProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertyManagerProjects.fulfilled, (state, action) => {
        state.loading = false;
        const response = action.payload;
        const projectsData = response.data || (Array.isArray(response) ? response : []);
        const paginationMeta = response.meta || {};

        // Helper function to parse amenities from JSON string to object
        const parseAmenities = (amenitiesStr) => {
          if (!amenitiesStr) return { park: false, gym: false, pool: false, security: false, parking: false };
          try {
            const amenitiesArray = typeof amenitiesStr === 'string' ? JSON.parse(amenitiesStr) : amenitiesStr;
            if (!Array.isArray(amenitiesArray)) return { park: false, gym: false, pool: false, security: false, parking: false };
            return {
              park: amenitiesArray.includes('Park'),
              gym: amenitiesArray.includes('Gym'),
              pool: amenitiesArray.includes('Pool'),
              security: amenitiesArray.includes('Security'),
              parking: amenitiesArray.includes('Parking'),
            };
          } catch (e) {
            return { park: false, gym: false, pool: false, security: false, parking: false };
          }
        };

        // Helper function to convert dld_waiver/post_handover_plan strings to booleans
        const parseBooleanField = (value) => {
          if (typeof value === 'boolean') return value;
          if (typeof value === 'string') {
            return value.toLowerCase().includes('available') || value.toLowerCase().includes('included');
          }
          return false;
        };

        // Transform API data to match component expectations
        state.items = projectsData.map((project) => {
          const parsedAmenities = parseAmenities(project.amenities);
          const googleMapCoords = project.google_map_coordinates;
          const mapCoordsStr = googleMapCoords 
            ? (typeof googleMapCoords === 'string' 
                ? googleMapCoords 
                : JSON.stringify(googleMapCoords))
            : '';

          return {
            id: project.id,
            projectId: project.project_id,
            projectName: project.project_name,
            projectType: project.project_type,
            status: project.status,
            expectedHandoverDate: project.expected_handover_date,
            constructionProgress: project.construction_progress,
            projectDescription: project.project_description,
            reraMunicipalityNumber: project.rera_municipality_number,
            reraNumber: project.rera_municipality_number, // Alias for AddProject
            country: project.country,
            selectedCountry: project.country, // Alias for AddProject
            city: project.city,
            selectedCity: project.city, // Alias for AddProject
            community: project.community,
            subCommunity: project.sub_community,
            googleMapCoordinates: googleMapCoords,
            mapCoordinates: mapCoordsStr, // Alias for AddProject
            amenities: parsedAmenities,
            amenitiesArray: typeof project.amenities === 'string' ? JSON.parse(project.amenities) : (project.amenities || []), // For display
            dldWaiver: parseBooleanField(project.dld_waiver),
            postHandoverPlan: parseBooleanField(project.post_handover_plan),
            priceRangeMin: project.price_range_min,
            priceMin: project.price_range_min, // Alias for AddProject
            priceRangeMax: project.price_range_max,
            priceMax: project.price_range_max, // Alias for AddProject
            serviceChargePerSqft: project.service_charge_per_sqft,
            estimatedRoi: project.estimated_roi,
            estimatedROI: project.estimated_roi, // Alias for AddProject
            paymentPlans: project.payment_plans || [],
            developer: project.developer,
            developerId: project.developer?.id, // For AddProject
            createdBy: project.created_by,
            masterplan: project.masterplan,
            floorPlans: project.floor_plans || [],
            images: project.images || [],
            videos: project.videos || [],
            media: project.media || [],
            dateAdded: project.created_at,
            _apiData: project,
          };
        });

        state.pagination = paginationMeta || {
          current_page: 1,
          per_page: 15,
          last_page: 1,
          total: projectsData.length,
        };
      })
      .addCase(fetchPropertyManagerProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to fetch projects';
        state.items = [];
      });

    // Fetch single project
    builder
      .addCase(fetchPropertyManagerProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertyManagerProjectById.fulfilled, (state, action) => {
        state.loading = false;
        const response = action.payload;
        const project = response.data || response;

        if (project && project.id) {
          // Helper function to parse amenities from JSON string to object
          const parseAmenities = (amenitiesStr) => {
            if (!amenitiesStr) return { park: false, gym: false, pool: false, security: false, parking: false };
            try {
              const amenitiesArray = typeof amenitiesStr === 'string' ? JSON.parse(amenitiesStr) : amenitiesStr;
              if (!Array.isArray(amenitiesArray)) return { park: false, gym: false, pool: false, security: false, parking: false };
              return {
                park: amenitiesArray.includes('Park'),
                gym: amenitiesArray.includes('Gym'),
                pool: amenitiesArray.includes('Pool'),
                security: amenitiesArray.includes('Security'),
                parking: amenitiesArray.includes('Parking'),
              };
            } catch (e) {
              return { park: false, gym: false, pool: false, security: false, parking: false };
            }
          };

          // Helper function to convert dld_waiver/post_handover_plan strings to booleans
          const parseBooleanField = (value) => {
            if (typeof value === 'boolean') return value;
            if (typeof value === 'string') {
              return value.toLowerCase().includes('available') || value.toLowerCase().includes('included');
            }
            return false;
          };

          const parsedAmenities = parseAmenities(project.amenities);
          const googleMapCoords = project.google_map_coordinates;
          const mapCoordsStr = googleMapCoords 
            ? (typeof googleMapCoords === 'string' 
                ? googleMapCoords 
                : JSON.stringify(googleMapCoords))
            : '';

          // Transform API data to match component expectations
          state.currentItem = {
            id: project.id,
            projectId: project.project_id,
            projectName: project.project_name,
            projectType: project.project_type,
            status: project.status,
            expectedHandoverDate: project.expected_handover_date,
            constructionProgress: project.construction_progress,
            projectDescription: project.project_description,
            reraMunicipalityNumber: project.rera_municipality_number,
            reraNumber: project.rera_municipality_number, // Alias for AddProject
            country: project.country,
            selectedCountry: project.country, // Alias for AddProject
            city: project.city,
            selectedCity: project.city, // Alias for AddProject
            community: project.community,
            subCommunity: project.sub_community,
            googleMapCoordinates: googleMapCoords,
            mapCoordinates: mapCoordsStr, // Alias for AddProject
            amenities: parsedAmenities,
            amenitiesArray: typeof project.amenities === 'string' ? JSON.parse(project.amenities) : (project.amenities || []), // For display
            dldWaiver: parseBooleanField(project.dld_waiver),
            postHandoverPlan: parseBooleanField(project.post_handover_plan),
            priceRangeMin: project.price_range_min,
            priceMin: project.price_range_min, // Alias for AddProject
            priceRangeMax: project.price_range_max,
            priceMax: project.price_range_max, // Alias for AddProject
            serviceChargePerSqft: project.service_charge_per_sqft,
            estimatedRoi: project.estimated_roi,
            estimatedROI: project.estimated_roi, // Alias for AddProject
            paymentPlans: project.payment_plans || [],
            developerId: project.developer?.id,
            developer: project.developer,
            createdBy: project.created_by,
            masterplan: project.masterplan,
            floorPlans: project.floor_plans || [],
            images: project.images || [],
            videos: project.videos || [],
            media: project.media || [],
            dateAdded: project.created_at,
            _apiData: project,
          };
        }
      })
      .addCase(fetchPropertyManagerProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to fetch project';
        state.currentItem = null;
      });

    // Create project
    builder
      .addCase(createPropertyManagerProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPropertyManagerProject.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally add the new project to the list
        const response = action.payload;
        const project = response.data || response;
        if (project && project.id) {
          const transformedProject = {
            id: project.id,
            projectId: project.project_id,
            projectName: project.project_name,
            projectType: project.project_type,
            status: project.status,
            expectedHandoverDate: project.expected_handover_date,
            constructionProgress: project.construction_progress,
            country: project.country,
            city: project.city,
            community: project.community,
            developer: project.developer,
            dateAdded: project.created_at,
            _apiData: project,
          };
          state.items.unshift(transformedProject);
          state.pagination.total += 1;
        }
      })
      .addCase(createPropertyManagerProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to create project';
      });

    // Update project
    builder
      .addCase(updatePropertyManagerProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePropertyManagerProject.fulfilled, (state, action) => {
        state.loading = false;
        const response = action.payload;
        const project = response.data || response;

        if (!project || !project.id) return;

        // Helper function to parse amenities from JSON string to object
        const parseAmenities = (amenitiesStr) => {
          if (!amenitiesStr) return { park: false, gym: false, pool: false, security: false, parking: false };
          try {
            const amenitiesArray = typeof amenitiesStr === 'string' ? JSON.parse(amenitiesStr) : amenitiesStr;
            if (!Array.isArray(amenitiesArray)) return { park: false, gym: false, pool: false, security: false, parking: false };
            return {
              park: amenitiesArray.includes('Park'),
              gym: amenitiesArray.includes('Gym'),
              pool: amenitiesArray.includes('Pool'),
              security: amenitiesArray.includes('Security'),
              parking: amenitiesArray.includes('Parking'),
            };
          } catch (e) {
            return { park: false, gym: false, pool: false, security: false, parking: false };
          }
        };

        // Helper function to convert dld_waiver/post_handover_plan strings to booleans
        const parseBooleanField = (value) => {
          if (typeof value === 'boolean') return value;
          if (typeof value === 'string') {
            return value.toLowerCase().includes('available') || value.toLowerCase().includes('included');
          }
          return false;
        };

        const parsedAmenities = parseAmenities(project.amenities);
        const googleMapCoords = project.google_map_coordinates;
        const mapCoordsStr = googleMapCoords 
          ? (typeof googleMapCoords === 'string' 
              ? googleMapCoords 
              : JSON.stringify(googleMapCoords))
          : '';

        if (state.currentItem?.id === project.id) {
          // Update the current item
          state.currentItem = {
            ...state.currentItem,
            projectName: project.project_name,
            projectType: project.project_type,
            status: project.status,
            expectedHandoverDate: project.expected_handover_date,
            constructionProgress: project.construction_progress,
            projectDescription: project.project_description,
            reraMunicipalityNumber: project.rera_municipality_number,
            reraNumber: project.rera_municipality_number,
            country: project.country,
            selectedCountry: project.country,
            city: project.city,
            selectedCity: project.city,
            community: project.community,
            subCommunity: project.sub_community,
            googleMapCoordinates: googleMapCoords,
            mapCoordinates: mapCoordsStr,
            amenities: parsedAmenities,
            amenitiesArray: typeof project.amenities === 'string' ? JSON.parse(project.amenities) : (project.amenities || []),
            dldWaiver: parseBooleanField(project.dld_waiver),
            postHandoverPlan: parseBooleanField(project.post_handover_plan),
            priceRangeMin: project.price_range_min,
            priceMin: project.price_range_min,
            priceRangeMax: project.price_range_max,
            priceMax: project.price_range_max,
            serviceChargePerSqft: project.service_charge_per_sqft,
            estimatedRoi: project.estimated_roi,
            estimatedROI: project.estimated_roi,
            paymentPlans: project.payment_plans || [],
            developerId: project.developer?.id,
            developer: project.developer,
            masterplan: project.masterplan,
            floorPlans: project.floor_plans || [],
            images: project.images || [],
            videos: project.videos || [],
            media: project.media || [],
            _apiData: project,
          };
        }

        // Update in list if present
        const index = state.items.findIndex(item => item.id === project.id);
        if (index !== -1) {
          const listItemAmenities = parseAmenities(project.amenities);
          const listItemMapCoords = project.google_map_coordinates;
          const listItemMapCoordsStr = listItemMapCoords 
            ? (typeof listItemMapCoords === 'string' 
                ? listItemMapCoords 
                : JSON.stringify(listItemMapCoords))
            : '';

          state.items[index] = {
            ...state.items[index],
            projectName: project.project_name,
            projectType: project.project_type,
            status: project.status,
            constructionProgress: project.construction_progress,
            country: project.country,
            selectedCountry: project.country,
            city: project.city,
            selectedCity: project.city,
            community: project.community,
            subCommunity: project.sub_community,
            googleMapCoordinates: listItemMapCoords,
            mapCoordinates: listItemMapCoordsStr,
            amenities: listItemAmenities,
            amenitiesArray: typeof project.amenities === 'string' ? JSON.parse(project.amenities) : (project.amenities || []),
            dldWaiver: parseBooleanField(project.dld_waiver),
            postHandoverPlan: parseBooleanField(project.post_handover_plan),
            priceRangeMin: project.price_range_min,
            priceMin: project.price_range_min,
            priceRangeMax: project.price_range_max,
            priceMax: project.price_range_max,
            developer: project.developer,
            developerId: project.developer?.id,
            _apiData: project,
          };
        }
      })
      .addCase(updatePropertyManagerProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to update project';
      });

    // Delete project
    builder
      .addCase(deletePropertyManagerProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePropertyManagerProject.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.meta.arg;
        // Remove from list
        state.items = state.items.filter(item => item.id !== deletedId);
        // Clear current item if it was deleted
        if (state.currentItem?.id === deletedId) {
          state.currentItem = null;
        }
        // Update pagination
        if (state.pagination.total > 0) {
          state.pagination.total -= 1;
        }
      })
      .addCase(deletePropertyManagerProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to delete project';
      });
  },
});

export const { clearProject, clearProjects } = projectsSlice.actions;

// Selectors
export const selectProjects = (state) => state.propertyManager.projects.items;
export const selectProject = (state) => state.propertyManager.projects.currentItem;
export const selectProjectsPagination = (state) => state.propertyManager.projects.pagination;
export const selectProjectsLoading = (state) => state.propertyManager.projects.loading;
export const selectProjectsError = (state) => state.propertyManager.projects.error;

export default projectsSlice.reducer;

