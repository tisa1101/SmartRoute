import pytest
import networkx as nx
from dsa.graph_algorithms import GraphAlgorithms
from dsa.tsp_optimizer import TSPOptimizer
from dsa.vrp_optimizer import VRPOptimizer

def test_dijkstra_vs_astar():
    G = nx.MultiDiGraph()
    G.add_node(1, x=0, y=0)
    G.add_node(2, x=1, y=1)
    G.add_node(3, x=2, y=2)
    G.add_edge(1, 2, length=1.4)
    G.add_edge(2, 3, length=1.4)
    G.add_edge(1, 3, length=3.0) # Longer direct path

    algo = GraphAlgorithms(G)
    
    res_d = algo.dijkstra(1, 3)
    res_a = algo.a_star(1, 3)
    
    assert res_d['path'] == [1, 2, 3]
    assert res_a['path'] == [1, 2, 3]
    # A* should explore fewer or equal nodes
    assert res_a['nodes_explored'] <= res_d['nodes_explored']

def test_tsp_nearest_neighbor():
    nodes = [1, 2, 3, 4]
    dist_matrix = {
        (1, 2): 10, (1, 3): 15, (1, 4): 20,
        (2, 3): 35, (2, 4): 25,
        (3, 4): 30
    }
    
    tsp = TSPOptimizer(dist_matrix, nodes)
    res = tsp.nearest_neighbor(1)
    
    assert res['path'][0] == 1
    assert res['path'][-1] == 1
    assert len(res['path']) == 5 # 4 nodes + return to start

def test_vrp_greedy():
    nodes = [1, 2, 3]
    dist_matrix = {(1, 2): 10, (1, 3): 15, (2, 3): 20}
    warehouse = 1
    orders = [
        {'id': 101, 'node': 2, 'weight': 10, 'priority': 1},
        {'id': 102, 'node': 3, 'weight': 20, 'priority': 5}
    ]
    vehicles = [
        {'id': 1, 'capacity': 10, 'weight_limit': 15},
        {'id': 2, 'capacity': 10, 'weight_limit': 30}
    ]
    
    vrp = VRPOptimizer(dist_matrix, warehouse, orders, vehicles)
    res = vrp.greedy_assignment()
    
    # Priority 5 (weight 20) should go to vehicle 2 since vehicle 1 has weight limit 15
    assert res['routes'][2] == [1, 3, 1]
    # Priority 1 (weight 10) can go to vehicle 1
    assert res['routes'][1] == [1, 2, 1]
