import time
from .tsp_optimizer import TSPOptimizer

class VRPOptimizer:
    def __init__(self, distance_matrix, warehouse_node, orders, vehicles):
        self.distance_matrix = distance_matrix
        self.warehouse_node = warehouse_node
        self.orders = orders # list of dicts: {'id', 'node', 'weight', 'priority'}
        self.vehicles = vehicles # list of dicts: {'id', 'capacity', 'weight_limit'}
        
    def get_distance(self, u, v):
        return self.distance_matrix.get((u, v), self.distance_matrix.get((v, u), float('inf')))

    def greedy_assignment(self):
        """Assigns orders to vehicles based on capacity and distance."""
        start_time = time.time()
        
        # Sort orders by priority (descending) and then distance from warehouse
        sorted_orders = sorted(self.orders, key=lambda x: (-x['priority'], self.get_distance(self.warehouse_node, x['node'])))
        
        vehicle_routes = {v['id']: [self.warehouse_node] for v in self.vehicles}
        vehicle_loads = {v['id']: 0 for v in self.vehicles}
        vehicle_counts = {v['id']: 0 for v in self.vehicles}
        unassigned_orders = []
        
        for order in sorted_orders:
            best_vehicle = None
            best_increase = float('inf')
            
            for v in self.vehicles:
                # Check capacity constraints (weight and package count)
                if vehicle_loads[v['id']] + order['weight'] <= v['weight_limit'] and vehicle_counts[v['id']] + 1 <= v['capacity']:
                    # Calculate cost to append to this vehicle's current route
                    last_node = vehicle_routes[v['id']][-1]
                    increase = self.get_distance(last_node, order['node'])
                    
                    if increase < best_increase:
                        best_increase = increase
                        best_vehicle = v['id']
                        
            if best_vehicle is not None:
                vehicle_routes[best_vehicle].append(order['node'])
                vehicle_loads[best_vehicle] += order['weight']
                vehicle_counts[best_vehicle] += 1
                order['assigned_vehicle'] = best_vehicle
            else:
                unassigned_orders.append(order)
                
        # Optimize each vehicle's route using TSP 2-opt
        optimized_routes = {}
        total_distance = 0
        
        for v_id, route in vehicle_routes.items():
            if len(route) > 1: # More than just warehouse
                nodes_in_route = list(set(route)) # unique nodes
                tsp = TSPOptimizer(self.distance_matrix, nodes_in_route)
                nn_result = tsp.nearest_neighbor(self.warehouse_node)
                opt_result = tsp.two_opt(nn_result['path'])
                
                optimized_routes[v_id] = opt_result['path']
                total_distance += opt_result['distance']
            else:
                optimized_routes[v_id] = [self.warehouse_node]
                
        end_time = time.time()
        
        return {
            'routes': optimized_routes,
            'unassigned': unassigned_orders,
            'total_distance': total_distance,
            'execution_time_ms': (end_time - start_time) * 1000
        }
