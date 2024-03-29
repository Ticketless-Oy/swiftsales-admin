import SearchField from '@src/components/SearchField/SearchField';
import React, { useCallback } from 'react';

const useSearch = (
	resources: any[],
	options: {
		searchColumns?: string[];
		customResourcesForFiltering?: {
			[key: string]: any[];
		};
	},
) => {
	const [searchTerm, setSearchTerm] = React.useState<string>('');
	const [filteredResources, setFilteredResources] = React.useState<any[]>(resources);

	const searchTermMatchesItem = useCallback(
		(resource: any, column: any) => {
			return resource[column].toLowerCase().includes(searchTerm.toLowerCase());
		},
		[searchTerm],
	);

	const handleCustomSalesAppointmentsSearch = useCallback(
		(resource: any) => {
			const lead = options.customResourcesForFiltering?.['leads'].find(
				lead => lead.leadID === resource['leadID'],
			);
			if (lead) {
				if (lead.companyName.toLowerCase().includes(searchTerm.toLowerCase())) {
					return true;
				}
			}
			return false;
		},
		[searchTerm, options.customResourcesForFiltering],
	);

	React.useEffect(() => {
		if (!searchTerm) {
			setFilteredResources(resources);
			return;
		}

		const filteredResources = resources.filter(resource => {
			if (resource['leadID']) {
				const foundMatch = handleCustomSalesAppointmentsSearch(resource);
				if (foundMatch) {
					return true;
				}
			}
			if (options.searchColumns) {
				for (let i = 0; i < options.searchColumns.length; i++) {
					const column = options.searchColumns[i];
					if (searchTermMatchesItem(resource, column)) {
						return true;
					}
				}
			}
			return false;
		});

		setFilteredResources(filteredResources);
	}, [searchTerm, resources, handleCustomSalesAppointmentsSearch, options.searchColumns, searchTermMatchesItem]);

	const renderSearchField = () => {
		return <SearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
	};

	return { searchTerm, renderSearchField, filteredResources };
};

export default useSearch;
